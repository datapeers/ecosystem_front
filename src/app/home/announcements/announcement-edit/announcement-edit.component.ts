import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { configTinyMce } from '@shared/models/configTinyMce';
import { Subject, filter, takeUntil, tap } from 'rxjs';
import { AnnouncementsService } from '../announcements.service';
import { Announcement } from '../model/announcement';
import { UpdateAnnouncementImageAction, UpdateAnnouncementAction, PublishAnnouncementAction } from '../store/announcement.actions';
import { cloneDeep } from 'lodash';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@shared/forms/custom-validators';
import { UpdateAnnouncementInput } from '../model/update-announcement.input';

@Component({
  selector: 'app-announcement-edit',
  templateUrl: './announcement-edit.component.html',
  styleUrls: ['./announcement-edit.component.scss']
})
export class AnnouncementEditComponent {
  onDestroy$: Subject<void> = new Subject();
  announcement: Announcement;
  forms: { id: string; label: string; }[] = [];
  configTiny = configTinyMce;
  landingUrl: string = '';
  announcementEditForm = new FormGroup({
    name: new FormControl<string>(null, { validators: [Validators.required] }),
    description: new FormControl<string>(null, { validators: [] }),
    landing: new FormControl<string>(null, { validators: [] }),
    exitText: new FormControl<string>(null, { validators: [] }),
    redirectLink: new FormControl<string>(null, { validators: [] }),
    form: new FormControl<string>(null, { validators: [Validators.required] }),
    startAt: new FormControl<Date>(null, { validators: [Validators.required] }),
    endAt: new FormControl<Date>(null, { validators: [Validators.required] }),
  }, { validators: [ CustomValidators.dateRangeValidator('startAt', 'endAt') ] });
  editEnabled: boolean = false;
  saving: boolean = false;
  canCreateForm: boolean = false;

  constructor(
    private readonly service: AnnouncementsService,
    private readonly formService: FormService,
    private readonly store: Store<AppState>,
  ) {
    this.store.select((state) => state.auth.user)
    .pipe(
      takeUntil(this.onDestroy$),
      filter(user => user != null)
    )
    .subscribe((user) => {
      this.canCreateForm = user.isAdmin || user.isSuperAdmin;
    });
    this.store.select((state) => state.announcement.announcement)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(announcement => announcement != null)
      )
      .subscribe((announcement) => {
        this.announcement = Announcement.fromJson(cloneDeep(announcement));
        this.announcementEditForm.reset({
          name: announcement.name,
          description: announcement.description,
          landing: announcement.landing,
          exitText: announcement.exitText,
          redirectLink: announcement.redirectLink,
          form: announcement.form._id,
          startAt: announcement.startAt,
          endAt: announcement.endAt,
        });
        this.saving = false;
        this.editEnabled = false;
      });
      this.landingUrl = `/landing/${this.announcement._id}`
  }

  ngOnInit() {
    this.formService.getFormByCollection(FormCollections.announcements).then((forms) => {
      this.forms = forms.map(form => ({ id: form._id, label: form.name }));
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  previewForm() {
    const { form: id } = this.announcementEditForm.getRawValue();
    const formName = this.forms.find(form => form.id === id).label;
    this.formService.openFormPreview(id, formName);
  }

  async createForm() {
    await this.formService.openFormApp();
  }

  publish() {
    this.store.dispatch(new PublishAnnouncementAction());
  }

  cancelEdit() {
    this.editEnabled = false;
  }

  saveFormChanges() {
    this.saving = true;
    let formValues = this.announcementEditForm.getRawValue();
    let updates: Partial<typeof formValues> = {};
    const updatedItems: UpdateAnnouncementInput = Object.entries(formValues).reduce((accu, [key, value]) => {
      if(value !== this.announcement[key]) {
        accu[key] = value;
      }
      return accu;
    }, updates);
    this.store.dispatch(new UpdateAnnouncementAction(updatedItems));
  }

  async uploadImage(fileToUpload: File, announcement: Announcement) {
    this.service
      .updateAnnouncementThumbnail(announcement, fileToUpload)
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Display upload progress if required
          }
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          this.service.updateAnnouncement(announcement._id, { thumbnail: event.url });
          this.store.dispatch(new UpdateAnnouncementImageAction(event.url));
        }
      });
  }

  removeImage(announcement: Announcement) {
    this.service.removeAnnouncementThumbnail(announcement).subscribe((event) => {
      if (event.type === HttpEventType.Response) {
        this.store.dispatch(new UpdateAnnouncementImageAction(''));
      }
    });
  }
}
