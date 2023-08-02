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
  events: any[] = [];

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

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private dialogService: DialogService,
    private service: CalendarService
  ) {
    this.setGraph();
  }

  ngOnInit(): void {
    this.loadingComponent = false;
    setTimeout(() => {
      this.resizeCalendar();
    }, 500);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
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
}
