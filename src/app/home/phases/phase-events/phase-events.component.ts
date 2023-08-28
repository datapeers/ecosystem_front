import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { PhaseEventsService } from './phase-events.service';
import { Event } from './models/events.model';
import { cloneDeep } from '@apollo/client/utilities';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Phase } from '../model/phase.model';
import { Table } from 'primeng/table';
import { ListedObject } from '@shared/components/datefilter/models/datefilter.interfaces';
import { differenceInMinutes } from 'date-fns';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActaComponent } from './acta/acta.component';
import { Acta } from './models/acta.model';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { QrViewComponent } from '@shared/components/qr-view/qr-view.component';
import { Permission } from '@auth/models/permissions.enum';
import { TypeEvent } from './models/types-events.model';
import { EventCreatorComponent } from './event-creator/event-creator.component';
import {
  attendanceType,
  attendanceTypeLabels,
} from './models/assistant-type.enum';
@Component({
  selector: 'app-phase-events',
  templateUrl: './phase-events.component.html',
  styleUrls: ['./phase-events.component.scss'],
})
export class PhaseEventsComponent implements OnInit, OnDestroy {
  loaded = false;
  showTypes = false;
  showCreatorType = false;
  newTypeEvent = TypeEvent.newEventType();
  typesEvents: TypeEvent[] = [];
  showedTypesEvents: { [s: string]: TypeEvent } = {};
  clonedTypesEvents: { [s: string]: TypeEvent } = {};
  typesEvent$: Subscription;

  phase: Phase;
  user: User;

  events$: Subscription;
  events: Event[];

  currentFilterType = 'contains';
  currentFilterField = 'item.nombre';
  currentFilterFieldName = 'Titulo';
  currentFilterFieldValue = '';
  tableData: ListedObject[] = [];
  list: ListedObject[];
  dataArray;

  ref: DynamicDialogRef | undefined;
  @ViewChild('dt') dataTableRef: Table;

  public get userPermission(): typeof Permission {
    return Permission;
  }

  public get attendanceLabels(): typeof attendanceTypeLabels {
    return attendanceTypeLabels;
  }

  typesNeeded = [
    '646f943cc2305c411d73f6d0', // Mentoría
    '646f9538c2305c411d73f6fb', // Asesorías
    '646f953cc2305c411d73f700', // Team coach
  ];

  constructor(
    private store: Store<AppState>,
    public dialogService: DialogService,
    private readonly toast: ToastService,
    private readonly service: PhaseEventsService,
    private confirmationService: ConfirmationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.typesEvent$?.unsubscribe();
    this.events$?.unsubscribe();
    this.ref?.close();
  }

  async loadComponent() {
    this.loaded = true;
    this.service
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
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    this.service
      .watchEvents(this.phase._id)
      .then((events$) => {
        this.events$ = events$.subscribe((eventList: Event[]) => {
          this.events = eventList;
          this.preloadTableItems();
        });
      })
      .catch((err) => {
        console.log(err);
        this.toast.alert({
          summary: 'Error al cargar eventos',
          detail: err,
          life: 12000,
        });
        this.events = [];
      });
  }

  preloadTableItems() {
    this.list = [];
    this.events.forEach((ev) => {
      const diffInMinutes = Math.abs(differenceInMinutes(ev.endAt, ev.startAt));
      const days = Math.floor(diffInMinutes / (24 * 60));
      const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
      const minutes = diffInMinutes % 60;

      let duration = '';

      if (days > 0) {
        duration += `${days} día${days > 1 ? 's' : ''} `;
      }

      if (hours > 0) {
        duration += `${hours} hora${hours !== 1 ? 's' : ''} `;
      }

      if (minutes > 0 || duration === '') {
        duration += `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
      }

      this.list.push({
        objectRef: ev,
        date: new Date(ev.startAt),
        name: ev.name,
        duration: hours,
        durationString: duration,
      });
    });
  }

  resetCreatorEventType() {
    this.showCreatorType = false;
    this.newTypeEvent = TypeEvent.newEventType();
  }

  createTypeEvent() {
    this.toast.info({ detail: '', summary: 'Creando' });
    this.service
      .createTypesEvent(this.newTypeEvent)
      .then((ans) => {
        this.toast.clear();
        this.resetCreatorEventType();
      })
      .catch(console.warn);
  }

  onTypeEventEditInit(typeEvent: TypeEvent) {
    this.clonedTypesEvents[typeEvent._id] = cloneDeep(typeEvent);
  }

  onTypeEventEditSave(typeEventToEdit: TypeEvent, index: number) {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateTypeEvent(typeEventToEdit.toSave())
      .then((ans) => {
        this.toast.clear();
        this.typesEvents[index] = typeEventToEdit;
        this.toast.success({
          detail: 'El tipo de evento ha sido editado exitosamente',
          summary: 'Tipo de evento editado!',
          life: 2000,
        });
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar tipo de evento',
          detail: err,
          life: 12000,
        });
        this.onTypeEventEditCancel(typeEventToEdit, index);
      });
  }

  onTypeEventEditCancel(typeEvent: TypeEvent, index: number) {
    this.typesEvents[index] = this.clonedTypesEvents[typeEvent._id];
    delete this.clonedTypesEvents[typeEvent._id];
  }

  deleteType(typeEventToEdit: TypeEvent, index: number) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere continuar?',
      message:
        'Al eliminar este tipo de evento, se limitará únicamente la creación de eventos futuros, mientras que los eventos pasados se conservarán tal como están. ¿Está seguro de que desea eliminar este tipo de evento?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteTypeEvent(typeEventToEdit._id)
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'El tipo de evento ha sido eliminado exitosamente',
              summary: 'Tipo de evento eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar tipo de evento',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  eventDelete(event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que desea continuar?',
      message: '¿Está seguro de que desea eliminar este evento?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteEvent(event._id)
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'El evento ha sido eliminado exitosamente',
              summary: 'Evento eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar evento',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  cancelEvent(event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Cancelar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que desea continuar?',
      message: '¿Está seguro de que desea cancelar este evento?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Cancelando...' });
        this.service
          .updateEvent({
            _id: event._id,
            isCanceled: true,
          })
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'El evento ha sido cancelado exitosamente',
              summary: 'Evento eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar evento',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  filter(stringToFilter: string) {
    this.dataTableRef.filter(stringToFilter, 'name', this.currentFilterType);
  }

  updateTable(event) {
    this.dataArray = event;
  }

  goToLink(url: string) {
    if (url) {
      window.open(url, '_blank');
    } else {
      this.toast.info({
        summary: 'Info',
        detail:
          'No hay enlace asociado a este evento virtual, editarlo para agregar un enlace valido',
        life: 2000,
      });
    }
  }

  showEvent(event?: Event) {
    this.ref = this.dialogService.open(EventCreatorComponent, {
      header: 'Evento',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event,
        batch: this.phase,
        user: this.user,
        typeEvents: this.typesEvents,
        extra_options: event?.extra_options ?? undefined,
      },
    });

    this.ref.onClose.subscribe((event: Event) => {
      if (event?._id) {
        console.log('se creo!');
      }
    });
  }

  showActa(event: Event) {
    this.ref = this.dialogService.open(ActaComponent, {
      header: 'Acta',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event,
        phase: this.phase,
        user: this.user,
      },
    });

    this.ref.onClose.subscribe((acta: Acta) => {
      if (acta?._id && !event.extra_options.acta) {
        this.service.updateEvent({
          _id: event._id,
          extra_options: { ...event.extra_options, acta: acta._id },
        });
      }
    });
  }

  canCreate() {
    return [ValidRoles.admin, ValidRoles.superAdmin].includes(
      this.user?.rolType as ValidRoles
    );
  }

  openQrWindow(event: Event) {
    const data = {
      title: `Registrar participación`,
      url: `${location.origin}/participation/${event._id}`,
    };
    const ref = this.dialogService.open(QrViewComponent, {
      header: '',
      data,
    });
    const subscription$ = ref.onClose.subscribe((_data) => {
      subscription$?.unsubscribe();
    });
  }
}
