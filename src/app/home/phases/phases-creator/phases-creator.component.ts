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

@Component({
  selector: 'app-phases-creator',
  templateUrl: './phases-creator.component.html',
  styleUrls: ['./phases-creator.component.scss'],
})
export class PhasesCreatorComponent implements OnInit, OnDestroy {
  phaseCreationForm: FormGroup;
  constructor(
    private readonly service: PhasesService,
    private readonly ref: DynamicDialogRef,
    readonly fb: FormBuilder
  ) {
    this.phaseCreationForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      description: new UntypedFormControl(''),
      childrenOf: new UntypedFormControl(null),
      thumbnail: new UntypedFormControl(null),
      startAt: new UntypedFormControl(null, Validators.required),
      endAt: new UntypedFormControl(null, Validators.required),
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  async onSubmit() {
    await this.service
      .createPhase({ ...this.phaseCreationForm.value, basePhase: true })
      .then((phase) => {
        this.ref.close(phase);
      });
  }
}
