import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ExpertsService } from '@shared/services/experts/experts.service';
import { StorageService } from '@shared/storage/storage.service';
import { HttpEventType } from '@angular/common/http';
import { PhaseExpertsService } from '../phase-experts/phase-experts.service';
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
  showCreatorEvent = false;
  newEvent = Event.newEvent();
  stateOptionsAssistant: any[] = [
    { label: 'Presencial', value: 'onsite' },
    { label: 'Virtual', value: 'virtual' },
  ];

  events$: Subscription;
  events: Event[];
  expertsList = [];
  selectedExperts = [];
  selectedParticipants = [];
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
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: PhaseEventsService,
    private readonly expertsServices: PhaseExpertsService,
    private readonly storageService: StorageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.typesEvent$?.unsubscribe();
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
    this.service
      .watchEvents()
      .then((events$) => {
        this.events$ = events$.subscribe((eventList: Event[]) => {
          this.events = eventList;
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
    this.expertsList = (
      await this.expertsServices.getDocuments({ phase: this.phase._id })
    ).map((doc) => {
      return {
        _id: doc._id,
        name: doc.item.nombre,
      };
    });
    console.log(this.expertsList);
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
    this.newEvent = Event.newEvent();
    this.selectedFiles = [];
  }

  async createEvent() {
    if (this.allowFiles && this.selectedFiles.length > 0) {
      this.newEvent.extra_options['files'] = [];
      for (const iterator of this.selectedFiles) {
        this.toast.clear();
        this.toast.info({
          summary: 'Subiendo archivo...',
          detail: 'Por favor espere, no cierre la ventana',
        });
        const fileUploaded: any = await firstValueFrom(
          this.storageService
            .uploadFile(
              `phases/${this.phase._id}/events/${this.newEvent.name}`,
              iterator.file
            )
            .pipe(first((event) => event.type === HttpEventType.Response))
        );
        this.newEvent.extra_options['files'].push({
          name: iterator.name,
          url: fileUploaded.url,
        });
      }
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

  removeParticipant(a) {}
}
