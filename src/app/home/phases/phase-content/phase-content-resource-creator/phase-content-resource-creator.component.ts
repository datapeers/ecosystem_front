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
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private toast: ToastService,
    private service: PhaseContentService
  ) {
    this.setForm();
  }

  ngOnInit() {
    this;
  }

  ngOnDestroy() {}

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
    const contentControls = {};
    if (this.phase.basePhase) {
      contentControls['duration'] = new UntypedFormControl(
        7,
        Validators.required
      );
    } else {
      contentControls['expiration'] = new UntypedFormControl(
        new Date(),
        Validators.required
      );
    }
    this.formResource.setControl(
      'extra_options',
      new UntypedFormGroup(contentControls)
    );
  }

  setResource(resource: IResource) {
    this.onlyView = resource;
    this.formResource.get('name').setValue(resource.name);
    this.formResource.get('type').patchValue(resource.type);
    this.formResource.get('hide').setValue(resource.hide);
    this.formResource.get('expiration').setValue(resource.expiration);
  }

  save() {
    this.busy = true;
    this.toast.info({ summary: 'Guardando...', detail: '' });
    this.service
      .createResource(this.formResource.value)
      .then((ans) => {
        this.ref.close(ans);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({ summary: 'Error al intentar guardar', detail: err });
        console.warn(err);
      });
  }
}
