import { Component, OnInit } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { PhaseEventsService } from '../phase-events.service';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import FileSaver from 'file-saver';
import { Permission } from '@auth/models/permissions.enum';
import { UserService } from '@auth/user.service';
import { StorageService } from '@shared/storage/storage.service';
import { PhaseExpertsService } from '@home/phases/phase-experts/phase-experts.service';
import { PhaseStartupsService } from '@home/phases/phase-startups/phase-startups.service';
import { Phase } from '@home/phases/model/phase.model';
import { User } from '@auth/models/user';
import {
  IEntityEvent,
  IEventFileExtended,
  newEvent,
} from '../models/events.model';
import {
  faClock,
  faPaperclip,
  faPlus,
  faTimes,
  faUserTie,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { TypeEvent } from '../models/types-events.model';
import { FormGroup } from '@angular/forms';
import { Subscription, first, firstValueFrom } from 'rxjs';
import {
  attendanceType,
  stateOptionsAssistant,
} from '../models/assistant-type.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Event } from '@home/phases/phase-events/models/events.model';
@Component({
  selector: 'app-event-creator',
  templateUrl: './event-creator.component.html',
  styleUrls: ['./event-creator.component.scss'],
})
export class EventCreatorComponent implements OnInit {
  // Main vars
  loaded = false;
  batch: Phase;
  user: User;
  typeEvents: TypeEvent[] = [];
  previousEvent: Event;
  event: FormGroup;
  extra_options: any = {};
  editingEvent = false;

  // ? Vars for change name
  changeType$: Subscription;

  // ? List options
  stateOptionsAssistant = stateOptionsAssistant;
  expertsList: IEntityEvent[] = [];
  startupsList: IItemStartup[] = [];
  entrepreneurList: IEntityEvent[] = [];
  teamCoachList: IEntityEvent[] = [];

  // ? Selected display
  experts: IEntityEvent[] = [];
  teamCoaches: IEntityEvent[] = [];
  participants: IEntityEvent[] = [];
  startups: IItemStartup[] = [];

  // ? vars for dropdowns
  selectedExperts: IEntityEvent[] = [];
  selectedParticipants: IEntityEvent[] = [];
  selectedStartups: IItemStartup[] = [];
  selectedTeamCoach: IEntityEvent[] = [];

  // ? File vars
  currentExpert;
  fileSizeLimit = 1000000;
  filesLimit = 5;
  allowFiles = false;
  selectedFiles: IEventFileExtended[] = [];

  // ? Icons
  faPaperclip = faPaperclip;
  faTimes = faTimes;
  faUserTie = faUserTie;
  faPlus = faPlus;
  faClock = faClock;
  faUsers = faUsers;

  public get userPermission(): typeof Permission {
    return Permission;
  }

  public get attendanceTypes(): typeof attendanceType {
    return attendanceType;
  }

  constructor(
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private toast: ToastService,
    private service: PhaseEventsService,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly expertsServices: PhaseExpertsService,
    private readonly phaseStartupsService: PhaseStartupsService
  ) {}

  ngOnInit(): void {
    this.loadComponent();
  }

  close(update?: boolean) {
    this.changeType$?.unsubscribe();
    this.ref.close(update);
  }

  async loadComponent() {
    this.loaded = false;
    this.setMainVars();

    // ? vars mandatory for component
    if (!this.batch) this.close();
    if (this.typeEvents.length === 0) this.close();
    await this.loadExperts();
    await this.loadStartUps();
    await this.loadTeamCoaches();

    if (this.previousEvent) this.setEditVars();
    this.subscriptionChanges();
    this.loaded = true;
  }

  setMainVars() {
    this.batch = this.config.data.batch;
    this.user = this.config.data.user;
    this.typeEvents = this.config.data.typeEvents;
    this.previousEvent = this.config.data.event;
    this.event = newEvent(this.batch, this.typeEvents, this.previousEvent);
    this.extra_options = this.config.data.event
      ? this.config.data.event.extra_options
      : {
          userCreated: this.user._id,
        };
  }

  setEditVars() {
    this.editingEvent = true;
    this.event.get('type').disable();
    this.experts = [...this.previousEvent.experts];
    this.teamCoaches = [...this.previousEvent.teamCoaches];
    this.participants = [...this.previousEvent.participants];
    const startupsAdded = new Set();
    this.startups = [];
    for (const participant of this.selectedParticipants) {
      const startup = this.startupsList.find((s) =>
        s.entrepreneurs.find((e) => e._id === participant._id)
      );
      if (startup && !startupsAdded.has(startup._id)) {
        this.startups.push(startup);
        startupsAdded.add(startup._id);
      }
    }
    if (this.previousEvent.extra_options.files)
      for (const fileDoc of this.previousEvent.extra_options.files) {
        this.selectedFiles.push(fileDoc);
      }
  }

  async loadExperts() {
    this.expertsList = (
      await this.expertsServices.getDocuments({ phase: this.batch._id })
    ).map((doc) => {
      return {
        _id: doc._id,
        name: doc.item.nombre,
      };
    });
  }

  async loadStartUps() {
    const startupsPhase = await this.phaseStartupsService.getDocuments({
      phase: this.batch._id,
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

  async loadTeamCoaches() {
    const teamCoachRequest = await this.userService.getUsers(
      '',
      [ValidRoles.teamCoach],
      { batches: this.batch._id }
    );
    this.teamCoachList = [];
    for (const teamCoach of teamCoachRequest) {
      this.teamCoachList.push({
        _id: teamCoach._id,
        name: teamCoach.fullName,
      });
    }
  }

  selectionType(selected) {
    const selectedType = this.typeEvents.find((i) => i._id === selected);
    if (selectedType && selectedType.extra_options?.allow_files) {
      this.allowFiles = true;
    } else {
      this.allowFiles = false;
      this.selectedFiles = [];
    }
  }

  // ? Subscription for detect changes when changes type, changes name
  subscriptionChanges() {
    this.changeType$ = this.event.get('type').valueChanges.subscribe((type) => {
      const currentName = this.event.get('name').value;
      const newType = this.typeEvents.find((i) => i._id === type);

      // Construir una expresión regular dinámica para los tipos de evento
      const typeRegex = new RegExp(
        `\\b${this.typeEvents.map((i) => i.name).join('\\b|\\b')}\\b`,
        'i'
      );
      if (typeRegex.test(currentName)) {
        const updatedName = currentName.replace(typeRegex, newType.name);
        this.event.get('name').setValue(updatedName);
      }
    });
  }

  async uploadFiles() {
    this.extra_options.files = [];
    for (const iterator of this.selectedFiles) {
      this.toast.clear();
      this.toast.info({
        summary: 'Subiendo archivo...',
        detail: 'Por favor espere, no cierre la ventana',
      });
      if (iterator.file) {
        const fileUploaded: any = await firstValueFrom(
          this.storageService
            .uploadFile(`phases/${this.batch._id}/events`, iterator.file)
            .pipe(first((event) => event.type === HttpEventType.Response))
        );
        this.extra_options['files'].push({
          name: iterator.name,
          url: fileUploaded.url,
        });
      } else {
        this.extra_options['files'].push({
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

  addStartup() {
    const startupAdded = new Set();
    for (const startup of this.startups) {
      startupAdded.add(startup._id);
    }
    for (let startup of this.selectedStartups) {
      for (const entrepreneur of startup.entrepreneurs) {
        if (this.participants.find((i) => i._id === entrepreneur._id)) {
          continue;
        }
        this.participants.push(entrepreneur);
        if (!startupAdded.has(startup._id)) {
          startupAdded.add(startup._id);
          this.startups.push(startup);
        }
      }
    }
    this.selectedStartups = [];
  }

  addExperts() {
    for (let res of this.selectedExperts) {
      if (this.experts.find((i) => i._id === res._id)) {
        continue;
      }
      this.experts.push(res);
    }
    this.selectedExperts = [];
  }

  removeExpert(id: string) {
    this.experts = this.experts.filter((r) => r._id != id);
  }

  addTeamCoach() {
    for (let res of this.selectedTeamCoach) {
      if (this.teamCoaches.find((i) => i._id === res._id)) {
        continue;
      }
      this.teamCoaches.push(res);
    }
    this.selectedTeamCoach = [];
  }

  removeTeamCoach(id: string) {
    this.teamCoaches = this.teamCoaches.filter((r) => r._id != id);
  }

  addParticipant() {
    for (let res of this.selectedParticipants) {
      if (this.participants.find((i) => i._id === res._id)) {
        continue;
      }
      this.participants.push(res);
    }
    this.selectedParticipants = [];
  }

  removeParticipant(id: string) {
    this.participants = this.participants.filter((r) => r._id != id);
  }

  async eventEdit() {
    // await this.uploadFiles();
    // this.toast.info({ detail: '', summary: 'Guardando...' });
    // this.service
    //   .updateEvent(this.newEvent)
    //   .then((ans) => {
    //     this.toast.clear();
    //     this.resetCreatorEvent();
    //   })
    //   .catch((err) => {
    //     this.toast.clear();
    //     this.toast.alert({
    //       summary: 'Error al editar evento',
    //       detail: err,
    //       life: 12000,
    //     });
    //   });
  }

  async createEvent() {
    if (moment(this.event.value.endAt).isBefore(this.event.value.startAt)) {
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
    this.service
      .createEvent({
        ...this.event.value,
        extra_options: this.extra_options,
        batch: this.batch._id,
        experts: this.experts,
        teamCoaches: this.teamCoaches,
        participants: this.participants,
      })
      .then((ans) => {
        this.toast.clear();
        this.close(true);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al crear evento',
          detail: err,
          life: 12000,
        });
      });
  }
}

interface IItemStartup extends IEntityEvent {
  entrepreneurs: IEntityEvent[];
}
