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
import { Phase } from '@home/phases/model/phase.model';
import { Content } from '@home/phases/model/content.model';
import * as moment from 'moment';

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
  parent_content;
  batch: Phase;
  lastSprint: Content;
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
    this.parent_content = this.config.data.content;
    this.batch = this.config.data.batch;
    this.lastSprint = this.config.data.lastSprint;
    console.log(this.lastSprint);
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
      phase: this.batch._id,
      extra_options: {
        sprint: this.parent_content ? false : true,
        duration: this.parent_content
          ? undefined
          : this.contentCreationForm.value.duration,
        parent: this.parent_content?._id,
      },
    };
    if (!this.batch.basePhase && newContent.extra_options.duration) {
      let startDate = moment(
        this.lastSprint
          ? new Date(this.lastSprint.extra_options.end)
          : this.batch.startAt
      );
      newContent.extra_options['start'] = startDate.add(1, 'days').toDate();
      newContent.extra_options['end'] = startDate.add(
        newContent.extra_options.duration,
        'days'
      );
      delete newContent.extra_options['duration'];
    }
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
