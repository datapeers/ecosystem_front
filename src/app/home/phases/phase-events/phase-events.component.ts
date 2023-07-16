import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { PhaseEventsService } from './phase-events.service';
import { Event, IEventFileExtended, TypeEvent } from '../model/events.model';
import { cloneDeep } from '@apollo/client/utilities';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Phase } from '../model/phase.model';
import {
  faClock,
  faPaperclip,
  faPlus,
  faTimes,
  faUserTie,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import FileSaver from 'file-saver';
import { StorageService } from '@shared/storage/storage.service';
import { HttpEventType } from '@angular/common/http';
import { PhaseExpertsService } from '../phase-experts/phase-experts.service';
import { PhaseStartupsService } from '../phase-startups/phase-startups.service';
import { Table } from 'primeng/table';
import { ListedObject } from '@shared/components/datefilter/models/datefilter.interfaces';
import { differenceInMinutes } from 'date-fns';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActaComponent } from './acta/acta.component';
import { Acta } from '../model/acta.model';
import * as moment from 'moment';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { QrViewComponent } from '@shared/components/qr-view/qr-view.component';
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
  showCreatorEvent = false;
  newEvent = Event.newEvent(null);
  stateOptionsAssistant: any[] = [
    { label: 'Presencial', value: 'onsite' },
    { label: 'Virtual', value: 'virtual' },
  ];
  optionsAssistant = {
    onsite: 'Presencial',
    virtual: 'Virtual',
  };
  events$: Subscription;
  events: Event[];

  expertsList = [];
  startupsList = [];
  entrepreneurList = [];

  selectedExperts = [];
  selectedParticipants = [];
  selectedStartups = [];

  currentExpert;
  //Limits
  fileSizeLimit = 1000000;
  filesLimit = 5;

  allowFiles = false;
  selectedFiles: IEventFileExtended[] = [];
  faPaperclip = faPaperclip;
  faTimes = faTimes;
  faUserTie = faUserTie;
  faPlus = faPlus;
  faClock = faClock;
  faUsers = faUsers;
  editingEvent = false;

  currentFilterType = 'contains';
  currentFilterField = 'item.nombre';
  currentFilterFieldName = 'Titulo';
  currentFilterFieldValue = '';
  tableData: ListedObject[] = [];
  list: ListedObject[];
  dataArray;

  ref: DynamicDialogRef | undefined;
  @ViewChild('dt') dataTableRef: Table;
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    public dialogService: DialogService,
    private readonly service: PhaseEventsService,
    private readonly expertsServices: PhaseExpertsService,
    private readonly storageService: StorageService,
    private readonly phaseStartupsService: PhaseStartupsService,
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
            if (this.typesEvents[0]?.extra_options?.allow_files)
              this.allowFiles = true;
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
    this.newEvent = Event.newEvent(this.phase);
    this.service
      .watchEvents(this.phase._id)
      .then((events$) => {
        this.events$ = events$.subscribe((eventList: Event[]) => {
          this.events = eventList;
          this.preloadTableItems();
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
    await this.loadExperts();
    await this.loadStartUps();
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

  async loadExperts() {
    this.expertsList = (
      await this.expertsServices.getDocuments({ phase: this.phase._id })
    ).map((doc) => {
      return {
        _id: doc._id,
        name: doc.item.nombre,
      };
    });
  }

  async loadStartUps() {
    const startupsPhase = await this.phaseStartupsService.getDocuments({
      phase: this.phase._id,
    });
    this.entrepreneurList = [];
    this.startupsList = [];
    for (const startUp of startupsPhase) {
      this.startupsList.push({
        _id: startUp._id,
        name: startUp.item.nombre,
        entrepreneurs: startUp.entrepreneurs.map((entrepreneur) => {
          return { _id: entrepreneur._id, name: entrepreneur.item.nombre };
        }),
      });
      for (const entrepreneur of startUp.entrepreneurs) {
        this.entrepreneurList.push({
          _id: entrepreneur._id,
          name: entrepreneur.item.nombre,
        });
      }
    }
  }

  openEdit(event) {
    this.newEvent = Event.newEvent(this.phase, cloneDeep(event));
    this.editingEvent = true;
    for (const fileDoc of this.newEvent.extra_options.files) {
      this.selectedFiles.push(fileDoc);
    }
    this.showCreatorEvent = true;
  }

  resetCreatorEventType() {
    this.showCreatorType = false;
    this.newTypeEvent = TypeEvent.newEventType();
    this.editingEvent = false;
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

  selectionType(selected) {
    const selectedType = this.typesEvents.find((i) => i._id === selected);
    if (selectedType && selectedType.extra_options?.allow_files) {
      this.allowFiles = true;
    } else {
      this.allowFiles = false;
      this.selectedFiles = [];
    }
  }

  resetCreatorEvent() {
    this.showCreatorEvent = false;
    this.newEvent = Event.newEvent(this.phase);
    this.selectedFiles = [];
  }

  async createEvent() {
    if (moment(this.newEvent.endAt).isBefore(this.newEvent.startAt)) {
      this.toast.alert({
        summary: 'Error de fechas',
        detail:
          'La fecha de inicio seleccionada es posterior a la fecha de término. Por favor, ajusta las fechas para continuar correctamente.',
      });
      return;
    }
    if (this.allowFiles && this.selectedFiles.length > 0) {
      await this.uploadFiles();
    }
    this.toast.clear();
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.newEvent.phase = this.phase._id;
    this.service
      .createEvent(this.newEvent)
      .then((ans) => {
        this.toast.clear();
        this.resetCreatorEvent();
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al crear evento',
          detail: err,
          life: 12000,
        });
        this.resetCreatorEvent();
      });
  }

  async uploadFiles() {
    this.newEvent.extra_options.files = [];
    for (const iterator of this.selectedFiles) {
      this.toast.clear();
      this.toast.info({
        summary: 'Subiendo archivo...',
        detail: 'Por favor espere, no cierre la ventana',
      });
      if (iterator.file) {
        const fileUploaded: any = await firstValueFrom(
          this.storageService
            .uploadFile(`phases/${this.phase._id}/events`, iterator.file)
            .pipe(first((event) => event.type === HttpEventType.Response))
        );
        this.newEvent.extra_options['files'].push({
          name: iterator.name,
          url: fileUploaded.url,
        });
      } else {
        this.newEvent.extra_options['files'].push({
          name: iterator.name,
          url: iterator.url,
        });
      }
    }
    this.toast.clear();
  }

  onUpload(event, target) {
    for (let newFile of event.files as File[]) {
      if (this.selectedFiles.length >= this.filesLimit) {
        // console.log('file limit reached');
        break;
      }
      if (!this.selectedFiles.some((f) => f.name == newFile.name)) {
        this.selectedFiles.push({
          file: newFile,
          name: newFile.name,
        });
      }
    }
    target.clear();
  }

  removeFile(fileName: string) {
    if (this.selectedFiles) {
      this.selectedFiles = this.selectedFiles.filter((f) => f.name != fileName);
    }
  }

  async downloadUrl(urlFile: string) {
    const key = this.storageService.getKey(urlFile);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      window.open(url, '_blank');
    }
  }

  async downloadFile(file: IEventFileExtended) {
    if (file.file) {
      FileSaver.saveAs(file.file);
      return;
    }
  }

  addExperts() {
    for (let res of this.selectedExperts) {
      if (this.newEvent.experts.find((i) => i._id === res._id)) {
        continue;
      }
      this.newEvent.experts.push(res);
    }
    this.selectedExperts = [];
  }

  removeExpert(id: string) {
    this.newEvent.experts = this.newEvent.experts.filter((r) => r._id != id);
  }

  addParticipant() {
    for (let res of this.selectedParticipants) {
      if (this.newEvent.participants.find((i) => i._id === res._id)) {
        continue;
      }
      this.newEvent.participants.push(res);
    }
    this.selectedParticipants = [];
  }

  removeParticipant(id: string) {
    this.newEvent.participants = this.newEvent.participants.filter(
      (r) => r._id != id
    );
  }

  addStartup() {
    for (let startup of this.selectedStartups) {
      for (const entrepreneur of startup.entrepreneurs) {
        if (
          this.newEvent.participants.find((i) => i._id === entrepreneur._id)
        ) {
          continue;
        }
        this.newEvent.participants.push(entrepreneur);
      }
    }
    this.selectedStartups = [];
  }

  async eventEdit() {
    await this.uploadFiles();
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateEvent(this.newEvent)
      .then((ans) => {
        this.toast.clear();
        this.resetCreatorEvent();
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar evento',
          detail: err,
          life: 12000,
        });
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
      this.user?.rol.type as ValidRoles
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
