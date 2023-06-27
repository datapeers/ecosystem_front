import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, IEventFileExtended } from '@home/phases/model/events.model';
import { Phase } from '@home/phases/model/phase.model';
import { Acta } from '@home/phases/model/acta.model';
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
} from '@fortawesome/free-solid-svg-icons';
import { configTinyMce } from '@shared/models/configTinyMce';
import { cloneDeep } from '@apollo/client/utilities';

@Component({
  selector: 'app-acta',
  templateUrl: './acta.component.html',
  styleUrls: ['./acta.component.scss'],
})
export class ActaComponent implements OnInit, OnDestroy {
  acta: Acta | any;
  event: Event;
  phase: Phase;
  saving = false;
  selectedFiles: IEventFileExtended[] = [];
  loaded = false;
  fileSizeLimit = 1000000;
  faUserTie = faUserTie;
  faPaperclip = faPaperclip;
  faCalendar = faCalendar;
  faTimes = faTimes;
  faClock = faClock;
  configTiny = configTinyMce;
  currentExpert;
  expertsHours = {};
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly service: ActaService,
    private readonly toast: ToastService,
    private readonly storageService: StorageService
  ) {
    this.event = this.config.data.event;
    this.phase = this.config.data.phase;
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {}

  loadComponent() {
    this.loaded = false;
    if (!this.event) this.close();
    if (!this.phase) this.close();
    this.service
      .getActa(this.event._id)
      .then((acta) => {
        this.acta = acta
          ? Acta.newActa(this.phase, this.event, cloneDeep(acta))
          : Acta.newActa(this.phase, this.event);

        for (const fileDoc of this.acta.extra_options.files) {
          this.selectedFiles.push(fileDoc);
        }
        for (const iterator of this.event.experts) {
          this.expertsHours[iterator._id] = this.acta.extra_options.expertHours
            ? this.acta.extra_options.expertHours[iterator._id]
            : 0;
        }
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

  async createActa() {
    this.saving = true;
    if (this.selectedFiles.length > 0) await this.uploadFiles();
    this.acta.extra_options['expertHours'] = this.expertsHours;
    this.toast.info({ summary: 'Guardando', detail: '' });
    this.service
      .createActa(this.acta)
      .then((act) => {
        this.acta = act;
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
    this.acta.extra_options.files = [];
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
        this.acta.extra_options['files'].push({
          name: iterator.name,
          url: fileUploaded.url,
        });
      } else {
        this.acta.extra_options['files'].push({
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

  async downloadFile(file: IEventFileExtended) {
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
    this.acta.extra_options['expertHours'] = this.expertsHours;
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateActa(this.acta)
      .then((ans) => {
        this.toast.clear();
        this.acta = ans;
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

  close() {
    this.ref.close(this.acta);
  }
}
