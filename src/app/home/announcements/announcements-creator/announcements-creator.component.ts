import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnnouncementsService } from '../announcements.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '@shared/services/toast.service';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import {
  AnnouncementTypes,
  announcementTypes,
} from '../model/announcement-types.enum';
import { CustomValidators } from '@shared/forms/custom-validators';
import { AnnouncementTargets } from '../model/announcement-targets.enum';

@Component({
  selector: 'app-announcements-creator',
  templateUrl: './announcements-creator.component.html',
  styleUrls: ['./announcements-creator.component.scss'],
})
export class AnnouncementsCreatorComponent implements OnInit, OnDestroy {
  announcementCreationForm = new FormGroup(
    {
      name: new FormControl<string>('', Validators.required),
      description: new FormControl<string>('', {
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      form: new FormControl<string>('', Validators.required),
      type: new FormControl<AnnouncementTypes>(null, {
        validators: [Validators.required],
      }),
      target: new FormControl<AnnouncementTargets>(null, {
        validators: [Validators.required],
      }),
      startAt: new FormControl<Date>(new Date(), Validators.required),
      endAt: new FormControl<Date>(new Date(), Validators.required),
    },
    { validators: [CustomValidators.dateRangeValidator('startAt', 'endAt')] }
  );

  announcementTypeNames = announcementTypes;
  forms: { id: string; label: string }[] = [];
  formExpert: { id: string; label: string };
  onlyForm: false;
  constructor(
    public config: DynamicDialogConfig,
    private readonly service: AnnouncementsService,
    private readonly ref: DynamicDialogRef,
    readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly formService: FormService
  ) {
    const type: AnnouncementTypes = this.config.data.type;
    const target: AnnouncementTargets = this.config.data.target;
    this.announcementCreationForm.patchValue({
      type: type,
      target: target,
    });
  }

  ngOnInit() {
    switch (this.config.data.target) {
      case AnnouncementTargets.experts:
        this.formService
          .getFormByCollection(FormCollections.experts)
          .then((forms) => {
            const formsExperts = forms.map((form) => ({
              id: form._id,
              label: form.name,
            }));
            this.forms = [formsExperts[0]];
          });
        break;
      case AnnouncementTargets.entrepreneurs:
        this.formService
          .getFormByCollection(FormCollections.announcements)
          .then((forms) => {
            this.forms = forms.map((form) => ({
              id: form._id,
              label: form.name,
            }));
          });
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {}

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.announcementCreationForm.invalid) return;
    const formValues = this.announcementCreationForm.getRawValue();
    this.toast.info({ summary: 'Creando...', detail: '' });
    this.service
      .createAnnouncement({ ...formValues })
      .then((announcement) => {
        this.toast.clear();
        this.ref.close(announcement);
      })
      .catch((err) => {
        this.toast.clear();
        console.error(err);
        this.toast.error({
          detail: 'Error al intentar crear la convocatoria',
        });
      });
  }
}
