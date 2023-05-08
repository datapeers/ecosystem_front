import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IResource } from '@home/phases/model/resource.model';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private toast: ToastService
  ) {
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
      expiration: new UntypedFormControl(null, Validators.required),
      extra_options: new UntypedFormGroup({}),
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

  setResource(resource: IResource) {
    this.onlyView = resource;
    this.formResource.get('name').setValue(resource.name);
    this.formResource.get('type').patchValue(resource.type);
    this.formResource.get('hide').setValue(resource.hide);
    this.formResource.get('expiration').setValue(resource.expiration);
  }

  save() {
    this.ref.close();
  }
}
