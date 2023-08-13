import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Content } from '@home/phases/model/content.model';
import { Phase } from '@home/phases/model/phase.model';
import { IResource } from '@home/phases/model/resource.model';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PhaseContentService } from '../phase-content.service';
import { StorageService } from '@shared/storage/storage.service';
import { Subject, first, firstValueFrom, takeUntil } from 'rxjs';
import { triggerControlValidators } from '@shared/utils/reactive-forms.utils';
import { HttpEventType } from '@angular/common/http';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { IDropItem } from '@shared/models/dropdown-item';
import {
  ResourcesTypes,
  resourcesTypesArray,
} from '@home/phases/model/resources-types.model';

@Component({
  selector: 'app-phase-content-resource-creator',
  templateUrl: './phase-content-resource-creator.component.html',
  styleUrls: ['./phase-content-resource-creator.component.scss'],
})
export class PhaseContentResourceCreatorComponent implements OnInit, OnDestroy {
  formResource: UntypedFormGroup;
  onlyView = null;
  resourcesTypes = resourcesTypesArray;
  busy = false;
  content: Content;
  phase: Phase;
  file;
  onDestroy$: Subject<boolean> = new Subject();
  listFields = [];
  load = false;
  forms: IDropItem[] = [];
  listFormsFiltered = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private toast: ToastService,
    private service: PhaseContentService,
    private storageService: StorageService,
    private formService: FormService
  ) {
    this.setForm();
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.load = false;
    if (!this.config.data.content) {
      this.toast.alert({ detail: '', summary: 'Se necesita un contenedor' });
      this.closeDialog();
      return;
    }
    if (!this.config.data.phase) {
      this.toast.alert({
        detail: '',
        summary: 'Se necesita conocer la fase del recurso',
      });
      this.closeDialog();
      return;
    }
    this.forms = (
      await this.formService.getFormByCollection(FormCollections.resources)
    ).map((form) => ({ id: form._id, label: form.name }));
    this.listFormsFiltered = [...this.forms];
    if (this.config.data.resource) {
      this.setResource(this.config.data.resource);
    }
    this.load = true;
  }

  setForm() {
    this.content = this.config.data.content;
    this.phase = this.config.data.phase;
    this.formResource = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      type: new UntypedFormControl(null, Validators.required),
      hide: new UntypedFormControl(false),
      phase: new UntypedFormControl(
        this.config.data.phaseID,
        Validators.required
      ),
      content: new UntypedFormControl(
        this.config.data.contentID,
        Validators.required
      ),
      extra_options: new UntypedFormGroup({}),
    });
    this.formResource
      .get('type')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((opt) => {
        this.setExtraFieldsByType(opt);
      });
  }

  setResource(resource: IResource) {
    this.onlyView = resource;
    this.formResource.get('name').setValue(resource.name);
    this.formResource.get('type').patchValue(resource.type);
    this.formResource.get('hide').setValue(resource.hide);
    for (const iterator of this.listFields) {
      switch (iterator.type) {
        case 'Date':
          this.formResource
            .get('extra_options')
            .get(iterator.key)
            .setValue(new Date(resource.extra_options[iterator.key]));
          break;
        case 'Forms':
          const item = this.forms.find(
            (i) => i.id === resource.extra_options[iterator.key]
          );
          this.formResource
            .get('extra_options')
            .get(iterator.key)
            .setValue(item);
          break;
        default:
          this.formResource
            .get('extra_options')
            .get(iterator.key)
            .setValue(resource.extra_options[iterator.key]);
          break;
      }
    }
  }

  setExtraFieldsByType(type: 'downloadable' | 'task' | 'form') {
    const contentControls = {};
    this.listFields = [
      {
        name: this.phase.basePhase ? 'Duración' : 'Fecha limite',
        key: this.phase.basePhase ? 'duration' : 'expiration',
        type: this.phase.basePhase ? 'Number' : 'Date',
      },
    ];
    contentControls[this.listFields[0].key] = new UntypedFormControl(
      this.phase.basePhase ? 7 : new Date(),
      Validators.required
    );
    switch (type) {
      case 'downloadable':
        contentControls['file'] = new UntypedFormControl(
          null,
          Validators.required
        );
        this.listFields.push({
          name: 'Archivo',
          key: 'file',
          type: 'File',
        });
        break;
      case 'task':
        contentControls['file'] = new UntypedFormControl(null);
        this.listFields.push({
          name: 'Plantilla',
          key: 'file',
          type: 'File',
        });
        break;
      case 'form':
        contentControls['form'] = new UntypedFormControl(
          null,
          Validators.required
        );
        this.listFields.push({
          name: 'Formulario',
          key: 'form',
          type: 'Forms',
        });
        break;
      default:
        break;
    }
    this.formResource.setControl(
      'extra_options',
      new UntypedFormGroup(contentControls)
    );
  }

  filterAutocomplete(event) {
    let query = event.query;
    const filtered = this.forms.filter(
      (data) =>
        data.label
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) !== -1
    );
    this.listFormsFiltered = [...filtered];
  }

  async save() {
    if (!this.formResource.valid) {
      triggerControlValidators(this.formResource);
      return;
    }
    this.busy = true;
    const newResource: IResource = {
      ...this.formResource.value,
      extra_options: {},
    };
    for (const iterator of this.listFields) {
      switch (iterator.type) {
        case 'File':
          if (!this.file && newResource.type === ResourcesTypes.task) {
            continue;
          }
          this.toast.info({
            summary: 'Subiendo archivo...',
            detail: 'Por favor espere, no cierre la ventana',
          });
          try {
            const fileUploaded: any = await firstValueFrom(
              this.storageService
                .uploadFile(`phases/${this.phase._id}/resources`, this.file)
                .pipe(first((event) => event.type === HttpEventType.Response))
            );
            newResource.extra_options[iterator.key] = fileUploaded.url;
            this.toast.info({
              summary: 'Archivo almacenado con éxito',
              detail: '',
            });
          } catch (error) {
            console.error(error);
            this.toast.info({
              summary: 'Error al subir archivo',
              detail: 'Ocurrió un error al intentar subir el archivo',
            });
            return;
          }
          continue;
        case 'Date':
          newResource.extra_options[iterator.key] = new Date(
            this.formResource.get('extra_options').get(iterator.key).value
          );
          continue;
        case 'Forms':
          newResource.extra_options[iterator.key] = this.formResource
            .get('extra_options')
            .get(iterator.key).value.id;
          continue;
        default:
          newResource.extra_options[iterator.key] = this.formResource
            .get('extra_options')
            .get(iterator.key).value;
          continue;
      }
    }
    this.toast.info({ summary: 'Guardando...', detail: '' });
    this.service
      .createResource(newResource)
      .then((ans) => {
        this.ref.close(ans);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({ summary: 'Error al intentar guardar', detail: err });
        console.warn(err);
      });
  }

  dealWithFiles(event) {
    this.formResource
      .get('extra_options')
      .get('file')
      .setValue(event.currentFiles[0].name);
    this.file = event.currentFiles[0];
  }

  clearFile(event) {
    this.formResource.get('extra_options').get('file').setValue(null);
    this.file = null;
  }

  async downloadFile() {
    const resource = this.config.data.resource;
    const file = resource?.extra_options?.file;
    const key = this.storageService.getKey(file);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      window.open(url, '_blank');
    }
  }

  previewForm() {
    const formResource = this.formResource.getRawValue();
    this.formService.openFormPreview(
      formResource.extra_options.form.id,
      formResource.extra_options.form.label
    );
  }

  closeDialog() {
    this.ref.close();
  }
}
