import { Component } from '@angular/core';
import { ApplicationStates } from '@home/announcements/model/application-states.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantsService } from '@shared/services/applicants/applicants.service';
import {
  ApplicantState,
  Attachment,
} from '@home/announcements/model/applicant-state';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Applicant } from '@shared/models/entities/applicant';
import { FileUpload } from 'primeng/fileupload';
import { tap } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';
import * as uuid from 'uuid';
import { ToastService } from '@shared/services/toast.service';

const attachmentFormGroup = (document: Attachment) =>
  new FormGroup({
    name: new FormControl<string>(document.name),
    url: new FormControl<string>(document.url),
    key: new FormControl<string>(document.key),
  });

@Component({
  selector: 'app-applicant-state-edit',
  templateUrl: './applicant-state-edit.component.html',
  styleUrls: ['./applicant-state-edit.component.scss'],
})
export class ApplicantStateEditComponent {
  announcementId: string;
  applicantId: string;
  currentState: ApplicationStates;
  documents: Attachment[] = [];
  form: FormGroup;
  maxLengthNotes: number = 120;
  applicant: Applicant;
  documentsFormArray: FormArray;
  get arrayFormControls(): FormGroup[] {
    return this.documentsFormArray.controls as FormGroup[];
  }
  get currentApplicantState(): ApplicantState {
    const { notes, documents } = this.form.value;
    return {
      notes: notes,
      documents: documents,
      type: this.currentState,
    };
  }

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly applicantsService: ApplicantsService,
    private readonly storageService: StorageService,
    private readonly toastService: ToastService
  ) {
    const { currentState, id, announcementId } = this.config.data;
    this.currentState = currentState;
    this.applicantId = id;
    this.announcementId = announcementId;
    this.documentsFormArray = new FormArray([]);
    this.form = new FormGroup({
      notes: new FormControl<string>('', {
        validators: [Validators.maxLength(this.maxLengthNotes)],
      }),
      documents: this.documentsFormArray,
    });
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }

  ngOnInit() {
    this.loadComponent();
  }

  async loadComponent() {
    const applicant = await this.applicantsService.getApplicant(
      this.applicantId,
      this.currentState
    );
    if (!applicant) return;
    this.applicant = applicant;
    const state = this.applicant.state;
    this.form.controls['notes'].setValue(state.notes);
    state.documents.forEach((document) => {
      this.documentsFormArray.push(attachmentFormGroup(document));
    });
  }

  removeFile(key: string, index: number) {
    const documents = this.currentApplicantState.documents.filter(
      (doc) => doc.key !== key
    );
    this.documentsFormArray.removeAt(index);
    this.documentsFormArray.controls = documents.map((doc) =>
      attachmentFormGroup(doc)
    );
    // this.applicantsService
    //   .removeStateAttachment(this.announcementId, this.applicantId, key)
    //   .subscribe(async (event) => {
    //     if (event.type === HttpEventType.Response) {
    //       const documents = this.currentApplicantState.documents.filter(
    //         (doc) => doc.key !== key
    //       );
    //       const updatedState: ApplicantState = {
    //         ...this.currentApplicantState,
    //         documents: documents,
    //       };
    //       const updateResult =
    //         await this.applicantsService.updateApplicantState(
    //           this.applicantId,
    //           updatedState
    //         );
    //       if (updateResult) {
    //         this.documentsFormArray.controls = documents.map((doc) =>
    //           attachmentFormGroup(doc)
    //         );
    //       }
    //     }
    //   });
  }

  async saveState() {
    const { notes, documents } = this.form.value;

    const updatedState: ApplicantState = {
      ...this.currentApplicantState,
      notes,
      documents,
    };
    await this.applicantsService.updateApplicantState(
      this.applicantId,
      updatedState
    );
    this.toastService.success({
      detail: 'Cambios guardados con éxito.',
    });
    this.close();
  }

  close() {
    this.ref.close();
  }

  onFileSelected(event: { files: File[] }, fileUploadElement: FileUpload) {
    const file = event.files[0];
    fileUploadElement.clear();
    if (file) {
      const fileUid = uuid.v4();
      this.applicantsService
        .pushStateAttachment(
          this.announcementId,
          this.applicantId,
          file,
          fileUid
        )
        .pipe(
          tap((event) => {
            if (event.type === HttpEventType.DownloadProgress) {
              // Display upload progress if required
            }
          })
        )
        .subscribe(async (event) => {
          if (event.type === HttpEventType.Response) {
            const realUrl = this.storageService.getPureUrl(event.url);
            const documents = this.currentApplicantState.documents;
            const newDocument = {
              name: file.name,
              url: realUrl,
              key: fileUid,
            };
            documents.push(newDocument);
            const updatedState: ApplicantState = {
              ...this.currentApplicantState,
              documents: documents,
            };
            const updateResult =
              await this.applicantsService.updateApplicantState(
                this.applicantId,
                updatedState
              );
            if (updateResult) {
              this.documentsFormArray.push(attachmentFormGroup(newDocument));
            }
          }
        });
    }
  }
}
