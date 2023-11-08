import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhasesService } from '../phases.service';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Stage } from '../model/stage.model';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-phases-creator',
  templateUrl: './phases-creator.component.html',
  styleUrls: ['./phases-creator.component.scss'],
})
export class PhasesCreatorComponent implements OnInit, OnDestroy {
  phaseCreationForm: FormGroup;
  stages: Stage[] = [];
  basePhase: boolean = true;
  constructor(
    public config: DynamicDialogConfig,
    private readonly service: PhasesService,
    private readonly ref: DynamicDialogRef,
    readonly fb: FormBuilder,
    private toast: ToastService
  ) {
    this.phaseCreationForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      description: new UntypedFormControl(''),
      stage: new UntypedFormControl('', Validators.required),
      childrenOf: new UntypedFormControl(null),
      thumbnail: new UntypedFormControl(null),
      startAt: new UntypedFormControl(new Date(), Validators.required),
      endAt: new UntypedFormControl(new Date()),
    });
  }

  ngOnInit() {
    this.stages = this.config.data.stages;
    console.log(this.stages);
    this.basePhase = this.config.data.basePhase;
    this.phaseCreationForm.get('stage').setValue(this.stages[0]._id);
    if (this.config.data.childrenOf)
      this.phaseCreationForm
        .get('childrenOf')
        .setValue(this.config.data.childrenOf);
  }

  ngOnDestroy() {}

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.toast.info({ summary: 'Creando...', detail: '' });
    this.service
      .createPhase({
        ...this.phaseCreationForm.value,
        basePhase: this.basePhase,
      })
      .then((phase) => {
        this.toast.clear();
        this.ref.close(phase);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({
          summary: 'Error al intentar crear fase',
          detail: err,
        });
      });
  }
}
