import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PhaseContentService } from '../phase-content.service';
import { ToastService } from '@shared/services/toast.service';
import { configTinyMce } from '@shared/models/configTinyMce';

@Component({
  selector: 'app-phase-content-creator',
  templateUrl: './phase-content-creator.component.html',
  styleUrls: ['./phase-content-creator.component.scss'],
})
export class PhaseContentCreatorComponent implements OnInit, OnDestroy {
  configTiny = configTinyMce;
  contentCreationForm: FormGroup;
  extra_options: {
    sprint: boolean;
    duration: number;
  };
  constructor(
    public config: DynamicDialogConfig,
    private readonly service: PhaseContentService,
    private readonly ref: DynamicDialogRef,
    readonly fb: FormBuilder,
    private toast: ToastService
  ) {
    this.contentCreationForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      content: new UntypedFormControl(''),
      duration: new UntypedFormControl(7, [Validators.required]),
    });
  }

  ngOnInit() {
    //     this.contentCreationForm.get('duration').setValue)()
  }

  ngOnDestroy() {}

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.toast.info({ summary: 'Creando...', detail: '' });
    const newContent = {
      name: this.contentCreationForm.value.name,
      content: this.contentCreationForm.value.content,
      phase: this.config.data.phase,
      extra_options: {
        sprint: this.config.data.sprint ?? false,
        duration: this.contentCreationForm.value.duration,
      },
    };
    this.service
      .createContent(newContent)
      .then((content) => {
        this.toast.clear();
        this.ref.close(content);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({
          summary: `Error al intentar crear ${
            this.config.data.sprint ? 'Sprint' : 'Contenido'
          }`,
          detail: err,
        });
      });
  }
}
