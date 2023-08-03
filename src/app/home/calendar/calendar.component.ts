import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from '@auth/models/user';
import { Phase } from '@home/phases/model/phase.model';
import {
  first,
  firstValueFrom,
  fromEvent,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { cloneDeep } from 'lodash';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CalendarService } from './calendar.service';
import { PhaseEventsService } from '@home/phases/phase-events/phase-events.service';
import { Event, TypeEvent } from '@home/phases/model/events.model';
import { ICalendarItem } from './models/item-calendar';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  formEnabled: boolean = false;
  activityNamesById: Record<string, string> = {};
  disableRequests: boolean = false;
  selectedActivity: any;
  activities: any[];
  currentLimit: number = 0;
  currentEventCount: number = 0;
  phase: Phase;
  user: User;
  // selectedEvent: CalendarEvent;
  openEventDialog: boolean = false;
  openActaDialog: boolean = false;
  openFilesDialog: boolean = false;
  userRequests: any[] = [];
  onDestroy$: Subject<boolean> = new Subject();
  participantId?: string;
  experts: any[];
  busy: boolean = false;

  loadingComponent = true;
  columns = [
    {
      header: 'Nombre',
      field: 'title',
    },
    {
      header: 'Fecha de inicio',
      field: 'start',
    },
    {
      header: 'Tipo',
      field: 'extendedProps.tipo.name',
    },
    {
      header: 'Responsable',
      field: 'extendedProps.responsible.name',
    },
    {
      header: 'Fecha solicitud',
      field: 'extendedProps.requestDate',
    },
    {
      header: 'Estado',
      field: 'extendedProps.state',
    },
  ];
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    buttonText: {
      // listMonth: 'Agenda mensual',
      listYear: 'Agenda anual',
      // listWeek: 'Agenda semanal',
      // listDay: 'Agenda diaria',
    },
    eventClick: ({ el, event, jsEvent, view }) => {
      //  this.selectedEvent = event;
      this.openEventDialog = true;
    },
    eventDidMount: ({ event, el }) => {
      // const props: Partial<EventProps> = event.extendedProps;
    },
    eventClassNames: 'cursor-pointer',
    headerToolbar: {
      start: 'dayGridMonth,timeGridWeek,timeGridDay listYear',
      center: 'title',
      end: 'prevYear,prev,next,nextYear',
    },
    locale: esLocale,
    selectable: true, // * important for activating date selectability!
    aspectRatio: 2.3,
  };
  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  //   plugins: [dayGridPlugin],
  // };
  events: ICalendarItem[] = [];

  dataAsesoria;
  optionsAsesoria;
  dataMentoria;
  optionsMentoria;
  showGraphs = false;
  resizeSubscription$: Subscription;
  withGraphs = '150px';
  heightGraphs = '150px';
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeCalendar();
    this.setSizeGraphs();
    this.showGraphs = false;
    setTimeout(() => {
      this.showGraphs = true;
    }, 1000);
  }

  showDifferentDesign = false;
  loaded = false;
  typesEvents: TypeEvent[] = [];
  showedTypesEvents: { [s: string]: TypeEvent } = {};
  typesEvent$: Subscription;
  events$: Subscription;
  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private dialogService: DialogService,
    private eventService: PhaseEventsService,
    private service: CalendarService
  ) {
    this.setGraph();
  }

  ngOnInit(): void {
    this.loadingComponent = false;
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.typesEvent$?.unsubscribe();
    this.events$?.unsubscribe();
    // this.ref?.close();
  }

  resizeCalendar() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.updateSize();
  }

  setGraph() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataAsesoria = {
      labels: ['Horas disponibles', 'Horas consumidas'],
      datasets: [
        {
          data: [6, 15],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    this.optionsAsesoria = {
      plugins: {
        legend: { display: false },
      },
    };
    this.dataMentoria = {
      labels: ['Horas disponibles', 'Horas consumidas'],
      datasets: [
        {
          data: [12, 10],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-300'),
            documentStyle.getPropertyValue('--yellow-300'),
          ],
        },
      ],
    };

    this.optionsMentoria = {
      plugins: {
        legend: { display: false },
      },
    };
    this.showGraphs = true;
  }

  setSizeGraphs() {
    if (window.innerWidth <= 900 || window.innerHeight <= 800) {
      this.withGraphs = '50px';
      this.heightGraphs = '50px';
    } else {
      this.withGraphs = '100px';
      this.heightGraphs = '100px';
    }
  }

  reorderSizes() {
    setTimeout(() => {
      this.resizeCalendar();
      this.setSizeGraphs();
    }, 300);
  }

  loadComponent() {
    this.loaded = true;
    this.eventService
      .watchTypesEvents()
      .then((typesEvent$) => {
        this.typesEvent$ = typesEvent$.subscribe(
          (typeEventList: TypeEvent[]) => {
            this.typesEvents = typeEventList.filter((x) => !x.isDeleted);
            for (const iterator of this.typesEvents)
              this.showedTypesEvents[iterator._id] = iterator;
            console.log(this.showedTypesEvents);
          }
        );
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar tipo de eventos',
          detail: err,
          life: 12000,
        });
        this.typesEvents = [];
      });
    this.service
      .watchEvents()
      .then((events$) => {
        this.events$ = events$.subscribe((eventList: Event[]) => {
          // this.events = eventList;
          this.events = [];
          for (const iterator of eventList) {
            this.assignItem(iterator);
          }
          this.resizeCalendar();
          console.log(this.events);
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar eventos',
          detail: err,
          life: 12000,
        });
        this.typesEvents = [];
      });
  }

  assignItem(event: Event) {
    this.events.push({
      id: event._id,
      title: event.name,
      start: event.startAt,
      end: event.endAt,
      extendedProps: {
        participants: event.participants,
        participantsName: event.participants.map((i) => i.name).join(', '),
        teamCoaches: event.teamCoaches,
        teamCoachesName: event.teamCoaches.map((i) => i.name).join(', '),
        experts: event.experts,
        expertsName: event.experts.map((i) => i.name).join(', '),
        batch: event.phase,
        type: this.showedTypesEvents[event.type]?.name,
      },
    });
  }
}
