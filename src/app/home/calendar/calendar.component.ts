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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarService } from './calendar.service';
import { PhaseEventsService } from '@home/phases/phase-events/phase-events.service';
import { Event } from '@home/phases/phase-events/models/events.model';
import { ICalendarItem } from './models/item-calendar';
import { ActaService } from '@home/phases/phase-events/acta/acta.service';
import { Acta, IActa } from '@home/phases/phase-events/models/acta.model';
import { StorageService } from '@shared/storage/storage.service';
import { ActaComponent } from '@home/phases/phase-events/acta/acta.component';
import { PhasesService } from '@home/phases/phases.service';
import { ExpertsService } from '../../shared/services/experts/experts.service';
import { Expert } from '@shared/models/entities/expert';
import { TypeEvent } from '@home/phases/phase-events/models/types-events.model';
import { RatingEventComponent } from './rating-event/rating-event.component';
import * as moment from 'moment';
import { Permission } from '@auth/models/permissions.enum';
import { Table } from 'primeng/table';
import { ShepherdService } from 'angular-shepherd';
import { PhaseHourConfigService } from '../phases/phase-hours-config/phase-hour-config.service';
import { calendarOnboarding } from '@shared/onboarding/onboarding.config';
import { IParticipationEvent } from '@home/phases/phase-events/models/participation.model';

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
  user: User;
  profileDoc;

  selectedEvent: ICalendarItem;
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
  ];
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    eventClick: async ({ el, event, jsEvent, view }) => {
      this.eventShow = {
        id: event.extendedProps['id'],
        title: event.extendedProps['title'],
        start: event.extendedProps['start'],
        end: event.extendedProps['end'],
        extendedProps: event.extendedProps,
      };
      await this.loadRating();
      this.openEventDialog = true;
    },
    eventDidMount: ({ event, el }) => {
      // const props: Partial<EventProps> = event.extendedProps;
    },
    eventClassNames: 'cursor-pointer',
    headerToolbar: {
      start: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      end: 'prevYear,prev,next,nextYear',
    },
    locale: esLocale,
    selectable: true, // * important for activating date selectability!
    aspectRatio: 3.2,
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
    // setTimeout(() => {
    //   this.showGraphs = true;
    // }, 1000);
    let resizeTimeout;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      this.scrollHeight = `${innerHeight - 446}px`;
    }, 250);
  }

  showDifferentDesign = false;
  typesEvents: TypeEvent[] = [];
  typesEventsWithHours: any[] = [];
  showedTypesEvents: { [s: string]: TypeEvent } = {};
  typesEvent$: Subscription;
  events$: Subscription;
  actas: IActa[] = [];
  phases: Phase[] = [];
  originalEvents: Event[] = [];
  ref: DynamicDialogRef | undefined;
  dialogSolicitude = false;
  dialogExperts = false;
  expertsDialog: Expert[] = [];
  startup;
  textSummary = `Mostrando {first} a {last} de {totalRecords}`;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  @ViewChild('dt', { static: true }) dt: Table;
  globalFilter = [];
  eventShow;
  scrollHeight;
  loadingRating = false;
  participation: IParticipationEvent;
  rating = 0;
  savingRating = false;
  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private dialogService: DialogService,
    private readonly actasService: ActaService,
    private readonly eventService: PhaseEventsService,
    private readonly service: CalendarService,
    private readonly expertsService: ExpertsService,
    private readonly phaseService: PhasesService,
    private readonly storageService: StorageService,
    private readonly phaseHourConfigService: PhaseHourConfigService,
    private readonly shepherdService: ShepherdService
  ) {
    this.scrollHeight = `${innerHeight - 446}px`;
    this.globalFilter = this.columns.map((i) => i.field);
    this.setGraph();
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadingComponent = false;
    this.loadComponent();
  }

  ngAfterViewInit() {
    /*this.shepherdService.defaultStepOptions = {
      classes: 'custom-class-name-1 custom-class-name-2',
      scrollTo: true,
      cancelIcon: {
        enabled: true,
      },
    };
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.addSteps([
      {
        attachTo: {
          element: '#bulb-calendar',
          on: 'top',
        },
        beforeShowPromise: function () {
          return new Promise<void>(function (resolve) {
            setTimeout(function () {
              window.scrollTo(0, 0);
              resolve();
            }, 500);
          });
        },
        text: 'El primer Texto',
        buttons: [
          {
            classes: 'button-blue p-button-raised',
            text: 'Exit',
            action() {
              console.log('Tour', this);
              this.next();
            },
          },
          {
            classes: 'shepherd-button-primary',
            text: 'Back',
            action: this.shepherdService.back,
          },
          {
            classes: 'shepherd-button-primary',
            text: 'Next',
            action: this.shepherdService.next,
          },
        ],
      },
      {
        title: 'Segundo Título',
        text: 'El Segundo Texto',
      },
    ]);
    this.shepherdService.start();*/
  }

  launchTour() {
    if (!this.user.isUser) return;
    this.shepherdService.addSteps(calendarOnboarding);
    this.shepherdService.start();
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

  async loadComponent() {
    this.loadingComponent = true;
    this.eventService
      .watchTypesEvents()
      .then((typesEvent$) => {
        this.typesEvent$ = typesEvent$.subscribe(
          (typeEventList: TypeEvent[]) => {
            this.typesEvents = typeEventList.filter((x) => !x.isDeleted);
            for (const iterator of this.typesEvents)
              this.showedTypesEvents[iterator._id] = iterator;
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
      .then(async (events$) => {
        this.events$ = events$.subscribe(async (eventList: Event[]) => {
          // this.events = eventList;
          this.actas = await this.actasService.getActasByEvents(
            eventList.map((i) => i._id)
          );

          this.phases = await this.phaseService.getPhases();
          this.events = [];
          this.originalEvents = eventList.sort((a, b) => {
            if (a.startAt > b.startAt) return -1; // Si 'a' es más reciente que 'b', 'a' debe ir antes
            if (a.startAt < b.startAt) return 1; // Si 'a' es más antiguo que 'b', 'b' debe ir antes
            return 0; // Si son iguales, no se cambia el orden
          });
          for (const iterator of eventList) {
            this.assignItem(iterator);
          }

          this.loadingComponent = false;
          setTimeout(() => {
            this.resizeCalendar();
          }, 100);
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
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
  }

  assignItem(event: Event) {
    this.events.push({
      id: event._id,
      title: event.name,
      start: event.startAt,
      end: event.endAt,
      extendedProps: {
        id: event._id,
        title: event.name,
        start: event.startAt,
        end: event.endAt,
        participants: event.participants,
        participantsName: event.participants.map((i) => i.name).join(', '),
        teamCoaches: event.teamCoaches,
        teamCoachesName: event.teamCoaches.map((i) => i.name).join(', '),
        experts: event.experts,
        expertsName: event.experts.map((i) => i.name).join(', '),
        batch: event.batch,
        type: this.showedTypesEvents[event.type]?.name,
        canViewFiles: event.extra_options.allow_viewFiles,
        acta: this.actas.find((i) => i.event === event._id),
        files: event.extra_options?.files,
        zoom: event.extra_options?.zoom,
      },
    });
  }

  viewFiles(evt: ICalendarItem) {
    this.selectedEvent = evt;
    this.openFilesDialog = true;
  }

  async downloadFile(urlFile: string) {
    const key = this.storageService.getKey(urlFile);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      window.open(url, '_blank');
    }
  }

  showActa(eventCalendar: ICalendarItem) {
    const event = this.originalEvents.find((i) => i._id === eventCalendar.id);
    this.ref = this.dialogService.open(ActaComponent, {
      header: 'Acta',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event,
        phase: this.phases.find(
          (i) => i._id === eventCalendar.extendedProps.batch
        ),
        user: this.user,
        onlyView: true,
      },
    });

    this.ref.onClose.subscribe((acta: Acta) => {
      if (acta?._id && !event.extra_options.acta) {
        this.eventService.updateEvent({
          _id: event._id,
          extra_options: { ...event.extra_options, acta: acta._id },
        });
      }
    });
  }

  async showDialogSolicitude() {
    this.toast.loading();
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    const batch = await firstValueFrom(
      this.store
        .select((store) => store.home.currentBatch)
        .pipe(first((i) => i !== null))
    );
    this.startup = this.profileDoc.startups[0];

    const hours = await firstValueFrom(
      await this.phaseHourConfigService.watchConfigPerStartup(
        (batch as Phase)._id,
        this.startup._id
      )
    );
    this.typesEventsWithHours = this.typesEvents.map((e) => ({
      ...e,
      target: hours.hours[e._id.toString()]?.target ?? 0,
      value: hours.hours[e._id.toString()]?.value ?? 0,
    }));
    this.toast.clear();
    this.dialogSolicitude = true;
  }

  async showDialogExperts() {
    this.toast.loading();
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    this.startup = this.profileDoc.startups[0];
    this.expertsDialog = await this.expertsService.getExpertsByStartup(
      this.startup._id
    );
    this.toast.clear();
    this.dialogExperts = true;
  }

  selectExpert(expert) {
    window.open(expert['calendlyLink'], '_blank');
  }

  selectEvent(url) {
    window.open(url);
  }

  async showRating(eventCalendar: ICalendarItem) {
    const event = this.originalEvents.find((i) => i._id === eventCalendar.id);
    this.startup = this.profileDoc.startups[0];

    let res = '50%';

    if (window.innerWidth < 640) {
      res = '100vw';
    } else if (window.innerWidth < 640) {
      res = '85vw';
    }
    this.ref = this.dialogService.open(RatingEventComponent, {
      header: 'Calificar evento',
      width: res,
      modal: false,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        event,
        phase: this.phases.find(
          (i) => i._id === eventCalendar.extendedProps.batch
        ),
        user: this.user,
        profileDoc: this.profileDoc,
        startup: this.startup,
      },
    });
  }

  todayAfter(date: Date) {
    return moment(new Date()).isAfter(date);
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Página ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }

  expertRol(): string {
    const roles = ['Mentor', 'Asesor'];
    const indiceAleatorio = Math.floor(Math.random() * roles.length);
    return roles[indiceAleatorio];
  }

  openZoom(event) {
    // if (this.todayAfter(event.end)) {
    //   console.log('video');
    //   return;
    // }
    window.open(event.extendedProps.zoom.join_url);
  }

  async loadRating() {
    this.loadingRating = false;
    this.participation = await this.eventService.getParticipation(
      this.eventShow.id,
      this.profileDoc._id
    );
    // if (!this.participation) {
    //   this.toast.alert({
    //     summary: 'No participaste en el evento',
    //     detail: 'No puedes calificar el evento, debido a que no participaste',
    //     life: 12000,
    //   });
    //   this.close();
    //   return;
    // }
    // this.rating = this.participation.metadata?.rating;
    this.rating = this.participation ? this.participation.metadata?.rating : 0;
    this.loadingRating = this.participation ? true : false;
  }

  async ratingChange() {
    this.savingRating = true;
    await this.eventService.updateParticipation(this.participation._id, {
      ...this.participation.metadata,
      rating: this.rating,
    });
    this.toast.info({ detail: '', summary: 'Evento calificado' });
    this.savingRating = false;
  }
}
