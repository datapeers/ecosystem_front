import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../authentication/user.service';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { User } from '@auth/models/user';
import { Subject, filter, take, takeUntil, tap } from 'rxjs';
import {
  UpdateUserAction,
  UpdateUserImageAction,
} from '@auth/store/auth.actions';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '@auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@shared/forms/custom-validators';
import { ExpertsService } from '@shared/services/experts/experts.service';
import { EntrepreneursService } from '@shared/services/entrepreneurs/entrepreneurs.service';
import { StorageService } from '../../storage/storage.service';
import { FormService } from '../../form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { ToastService } from '@shared/services/toast.service';
import { AdminService } from 'src/app/admin/admin.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  onDestroy$: Subject<void> = new Subject();
  loaded: boolean = false;
  passwordDialog: boolean = false;
  changePasswordForm: FormGroup;
  profileDoc;
  noValuePlaceholder: string = '- - - -';
  formProfileFields: any[] = [];
  accountParams = [
    {
      label: 'Calendly link',
      key: 'calendlyLink',
      onChange: ($event) => {
        this.change = $event.target.value;
        this.saveSimpleChange('calendlyLink');
      },
    },
  ];
  change;
  rating = 4;
  formEntrepreneur;
  fieldsEntrepreneur = [];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private store: Store<AppState>,
    private adminService: AdminService,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly formService: FormService,
    private readonly storageService: StorageService,
    private readonly expertsService: ExpertsService,
    private readonly entrepreneursService: EntrepreneursService
  ) {
    this.store
      .select((storeState) => storeState.auth.user)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((user) => user !== null)
      )
      .subscribe((userState) => {
        this.user = cloneDeep(userState);
      });

    this.changePasswordForm = fb.group(
      {
        currentPassword: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        newPassword: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        confirmNewPassword: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [
          CustomValidators.MatchValidator('confirmNewPassword', 'newPassword'),
        ],
      }
    );
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    if (this.user.isExpert) this.loadExpertProfile();
    if (this.user.isUser) this.loadEntrepreneurProfile();
  }

  async uploadImage(fileToUpload: File, user: User) {
    this.userService
      .updateProfileImage(user, fileToUpload)
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Display upload progress if required
          }
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          const realUrl = this.storageService.getPureUrl(event.url);
          this.store.dispatch(new UpdateUserImageAction(realUrl));
        }
      });
  }

  removeImage(user: User) {
    this.userService.removeProfileImage(user).subscribe((event) => {
      if (event.type === HttpEventType.Response) {
        this.store.dispatch(new UpdateUserImageAction(''));
      }
    });
  }

  openPasswordDialog() {
    this.changePasswordForm.reset();
    this.passwordDialog = true;
  }

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  async onSubmit() {
    if (this.changePasswordForm.invalid) return;
    this.passwordDialog = false;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    await this.authService.updateUserPassword(currentPassword, newPassword);
  }

  async loadExpertProfile() {
    this.profileDoc = await this.expertsService.getUserDoc(this.user);
    const formDoc = await this.formService.getFormByCollection(
      FormCollections.experts
    );
    // console.log(form);
    // const formComponents = this.formService.getFormComponents(form);
    this.formProfileFields = this.formService.getInputComponents(
      formDoc[0].form.components
    );
    // console.log(this.formProfileFields);
  }

  async loadEntrepreneurProfile() {
    this.profileDoc = await this.entrepreneursService.getUserDoc(this.user);
    const formDoc = await this.formService.getFormByCollection(
      FormCollections.entrepreneurs
    );
    this.formEntrepreneur = formDoc.find(() => true);
    console.log(this.formEntrepreneur);
    const formNegociosComponents = this.formService.getFormComponents(
      this.formEntrepreneur
    );
    this.fieldsEntrepreneur = this.formService.getInputComponents(
      formNegociosComponents
    );
  }

  async editEntrepreneurDoc() {
    this.toast.loading();
    const subscription = await this.formService.createFormSubscription({
      form: this.formEntrepreneur._id,
      reason: 'Editar datos de empresario',
      data: {},
      doc: this.profileDoc._id,
    });
    this.toast.clear();
    const ref = this.formService.openFormFromSubscription(
      subscription,
      'Editar startup'
    );
    ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe(async (doc) => {
      if (doc) {
        this.profileDoc = await this.entrepreneursService.getUserDoc(this.user);
      }
    });
  }

  saveChanges() {
    this.toast.info({ summary: 'Guardando...', detail: '' });
    this.adminService
      .updateUser(this.user._id, {
        fullName: this.user.fullName,
      })
      .then((ans) => {
        this.toast.clear();
        this.store.dispatch(new UpdateUserAction(new User(ans)));
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al guardar cambios',
          detail: err,
          life: 12000,
        });
      });
  }

  async saveSimpleChange(param: string) {
    try {
      if (param === 'calendlyLink') {
        if (!this.change.startsWith('https://calendly.com/')) {
          this.toast.alert({
            summary: 'Link invalido',
            detail: 'El; link de calendly escrito es invalido!',
          });
          return;
        }
      }
      let toChange = { _id: this.profileDoc._id };
      toChange[param] = this.change;
      let request;
      if (this.user.isExpert)
        request = await this.expertsService.updateExpert(toChange);

      if (!request) {
        this.toast.alert({ detail: '', summary: 'El cambio no se realizo' });
        return;
      }
      this.toast.success({
        detail: '',
        summary: 'Cambios guardados',
        life: 2000,
      });
    } catch (err) {
      console.warn(err);
      this.toast.error({
        detail:
          'Al intentar guardar cambios, ocurrió un problema, comuníquese con un administrador',
        summary: 'Ocurrió un problema',
      });
    }
  }
}
