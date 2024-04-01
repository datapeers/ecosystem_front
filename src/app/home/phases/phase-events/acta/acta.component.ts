import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event } from '@home/phases/phase-events/models/events.model';
import { Phase } from '@home/phases/model/phase.model';
import { Acta, newActa } from '@home/phases/phase-events/models/acta.model';
import { ActaService } from './acta.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '@shared/services/toast.service';
import FileSaver from 'file-saver';
import { first, firstValueFrom } from 'rxjs';
import { StorageService } from '@shared/storage/storage.service';
import { HttpEventType } from '@angular/common/http';
import {
  faCalendar,
  faPaperclip,
  faTimes,
  faUserTie,
  faClock,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { configTinyMce } from '@shared/models/configTinyMce';
import { User } from '@auth/models/user';
import { ConfirmationService } from 'primeng/api';
import { Permission } from '@auth/models/permissions.enum';
import { FormGroup } from '@angular/forms';
import { IFileUploadExtended } from '@shared/models/file';
import { fileSizeMb } from '@shared/functions/file-size';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-acta',
  templateUrl: './acta.component.html',
  styleUrls: ['./acta.component.scss'],
})
export class ActaComponent implements OnInit {
  acta: FormGroup;
  actaDoc: Acta;
  event: Event;
  phase: Phase;
  saving = false;
  loaded = false;

  // Files
  selectedFiles: IFileUploadExtended[] = [];
  fileSizeLimit = 11000000;
  invalidFileSizeMessageSummary = '{0}: Tamaño de archivo no válido';
  invalidFileSizeMessageDetail = `Solo se permiten archivos de un máximo de ${fileSizeMb(
    this.fileSizeLimit
  )}.`;

  // ? Icons
  faUserTie = faUserTie;
  faPaperclip = faPaperclip;
  faCalendar = faCalendar;
  faTimes = faTimes;
  faClock = faClock;
  faEye = faEye;
  configTiny = configTinyMce;
  currentExpert;
  expertsHours = {};
  user: User;
  onlyView = false;
  configHoursExpert;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly service: ActaService,
    private readonly toast: ToastService,
    private readonly storageService: StorageService,
    private confirmationService: ConfirmationService
  ) {
    this.event = this.config.data.event;
    this.phase = this.config.data.phase;
    this.user = this.config.data.user;
    this.onlyView = this.config.data.onlyView;
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    this.loaded = false;
    if (!this.event) this.close();
    if (!this.phase) this.close();
    this.service
      .getActa(this.event._id)
      .then((acta) => {
        this.acta = acta
          ? newActa(this.phase, this.event, acta)
          : newActa(this.phase, this.event);
        this.actaDoc = acta;
        this.setVars();
        this.loaded = true;
      })
      .catch((err) => {
        console.warn(err);
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al intentar cargar acta',
          detail: err,
          life: 12000,
        });
      });
  }

  setVars() {
    for (const fileDoc of this.actaDoc?.extra_options.files) {
      this.selectedFiles.push(fileDoc);
    }
    for (const iterator of this.event.experts) {
      this.expertsHours[iterator._id] = this.actaDoc?.extra_options.expertHours
        ? cloneDeep(this.actaDoc.extra_options.expertHours[iterator._id])
        : { done: 0, donated: 0 };
    }
    if (this.actaDoc.closed || this.onlyView) {
      for (const keyControl of Object.keys(this.acta.value)) {
        this.acta.get(keyControl).disable();
      }
    }
  }

  async createActa() {
    this.saving = true;
    if (this.selectedFiles.length > 0) await this.uploadFiles();
    this.actaDoc.extra_options['expertHours'] = this.expertsHours;
    this.toast.info({ summary: 'Guardando', detail: '' });
    this.service
      .createActa({
        ...this.actaDoc,
        ...this.acta.value,
        event: this.event._id,
        phase: this.phase._id,
      })
      .then((act) => {
        this.toast.clear();
        this.actaDoc = act;
        this.close();
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al intentar crear acta',
          detail: err,
          life: 12000,
        });
      });
  }

  async uploadFiles() {
    this.actaDoc.extra_options.files = [];
    for (const iterator of this.selectedFiles) {
      this.toast.clear();
      this.toast.info({
        summary: 'Subiendo archivo...',
        detail: 'Por favor espere, no cierre la ventana',
      });
      if (iterator.file) {
        const fileUploaded: any = await firstValueFrom(
          this.storageService
            .uploadFile(
              `phases/${this.phase._id}/events/${this.event._id}/actas/`,
              iterator.file
            )
            .pipe(first((event) => event.type === HttpEventType.Response))
        );
        this.actaDoc.extra_options['files'].push({
          name: iterator.name,
          url: fileUploaded.url,
        });
      } else {
        this.actaDoc.extra_options['files'].push({
          name: iterator.name,
          url: iterator.url,
        });
      }
    }
    this.toast.clear();
  }

  onUpload(event, target) {
    for (let newFile of event.files as File[]) {
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

  async downloadFile(file: IFileUploadExtended) {
    if (file.file) {
      FileSaver.saveAs(file.file);
      return;
    }
  }

  action(type: 'create' | 'edit') {
    switch (type) {
      case 'create':
        this.createActa();
        break;
      case 'edit':
        this.actaEdit();
        break;
      default:
        break;
    }
  }

  async actaEdit() {
    await this.uploadFiles();
    this.actaDoc.extra_options['expertHours'] = this.expertsHours;
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateActa({
        ...this.actaDoc,
        ...this.acta.value,
        event: this.event._id,
        phase: this.phase._id,
      })
      .then((ans) => {
        this.toast.clear();
        this.actaDoc = ans;
        this.toast.success({
          summary: 'Cambios guardados!',
          detail: '',
          life: 2000,
        });
        this.close();
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar acta',
          detail: err,
          life: 12000,
        });
      });
  }

  closeActa() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Cerrar acta',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere continuar?',
      message:
        'Al cerrar el acta esta no se permitirá editar nunca mas, ¿Desea cerrarla?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Cerrando acta...' });
        this.service
          .updateActa({ _id: this.actaDoc._id, closed: true })
          .then((ans) => {
            this.toast.clear();
            this.actaDoc = ans;
            this.toast.success({
              summary: 'Acta cerrada!',
              detail: '',
              life: 2000,
            });
            this.close();
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al cerrar acta',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  close() {
    this.ref.close(this.actaDoc);
  }
}
