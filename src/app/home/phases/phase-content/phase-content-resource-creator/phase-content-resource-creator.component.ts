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
import { StorageService } from '@shared/services/storage.service';
import { Subject, first, firstValueFrom, takeUntil } from 'rxjs';
import { triggerControlValidators } from '@shared/utils/reactive-forms.utils';
import { StoragePaths } from '@shared/services/storage.constants';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-phase-content-resource-creator',
  templateUrl: './phase-content-resource-creator.component.html',
  styleUrls: ['./phase-content-resource-creator.component.scss'],
})
export class PhaseContentResourceCreatorComponent implements OnInit, OnDestroy {
  formResource: UntypedFormGroup;
  onlyView = null;
  resourcesTypes = [
    { value: 'downloadable', label: 'Descargable' },
    { value: 'task', label: 'Entregable' },
    { value: 'form', label: 'Formulario' },
  ];
  busy = false;
  content: Content;
  phase: Phase;
  file;
  onDestroy$: Subject<boolean> = new Subject();
  listFields = [];
  listForms = [];
  listFormsFiltered = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private toast: ToastService,
    private service: PhaseContentService,
    private storageService: StorageService
  ) {
    this.setForm();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
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
      case 'form':
        contentControls['form'] = new UntypedFormControl(
          null,
          Validators.required
        );
        this.listFields.push({
          name: 'Formulario',
          key: 'form',
          type: 'String',
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
    const filtered = this.listForms.filter(
      (data) =>
        data.nombre
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
            console.log(fileUploaded.url);
            newResource.extra_options[iterator.key] = fileUploaded.url;
            this.toast.info({
              summary: 'Archivo almacenado con éxito',
              detail: '',
            });
            console.log(newResource.extra_options);
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
            .get(iterator.key).value._id;
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

  downloadFile() {
    const resource = this.config.data.resource;
    const file = resource?.file;
    const key = this.storageService.getKey(file);
    const url = this.storageService.getFile(key);
    // if (url) {
    //   window.open(url, '_blank');
    // }
  }

  async loadForms() {
    // const forms = this.resourceTypes.find((i) => i.type === 'forms');
    // if (forms) {
    //   try {
    //     const formsSubscription = await this.formService.get_forms_collection(
    //       this.institute.dbName,
    //       'datos_recursos'
    //     );
    //     const forms = await firstValueFrom(formsSubscription);
    //     this.listForms = [...forms];
    //     this.listFormsFiltered = [...forms];
    //   } catch (error) {
    //     this.toast.alert({
    //       summary: 'No se cargaron formularios',
    //       detail:
    //         'Problema al intentar cargar la lista de formularios disponibles para recursos',
    //     });
    //   }
    // }
  }

  async show() {
    // let dbName = this.institute.dbName;
    // let id = this.formResource.get('contenido').get('contenido').value._id;
    // let url = `${environment.forms}view/${id}/${dbName}`;
    // window.open(url, '_blank');
  }
}
