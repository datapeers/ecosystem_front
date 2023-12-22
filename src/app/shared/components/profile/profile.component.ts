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
import { textField } from '@shared/utils/order-field-multiple';
import { UserConfig } from '@auth/models/user-config';
import { EmailNotificationTypes } from '@auth/models/email-notification-types';

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
  userConfig: UserConfig;
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
  viewRating = false;
  form;
  fields = [];
  notificationsConfig: { type: EmailNotificationTypes; label: string }[] = [
    {
      label: 'Invitación a evento',
      type: EmailNotificationTypes.invitationToEvent,
    },
    { label: 'Actualización Evento', type: EmailNotificationTypes.eventUpdate },
    {
      label: 'Recurso calificado',
      type: EmailNotificationTypes.qualifiedResource,
    },
    // { label: "Recurso próximo a vencer", type: EmailNotificationTypes.resourceExpiringSoon },
    {
      label: 'Culminación de fase',
      type: EmailNotificationTypes.phaseCompletion,
    },
    {
      label: 'Evaluación disponible',
      type: EmailNotificationTypes.assessmentAvailable,
    },
    {
      label: 'Actualización ticket mesa de ayuda',
      type: EmailNotificationTypes.helpdeskTicketUpdate,
    },
  ];

  // -----------
  basicData: any;
  basicOptions: any;

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
    if (this.user.isExpert || this.user.isTeamCoach) this.viewRating = true;
    if (this.user.isExpert) this.loadExpertProfile();
    if (this.user.isUser) this.loadEntrepreneurProfile();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
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
    this.form = formDoc.find(() => true);
    const components = this.formService.getFormComponents(this.form);
    this.fields = this.formService.getInputComponents(components);
  }

  async loadEntrepreneurProfile() {
    this.userConfig = await this.userService.getUserConfig(this.user.uid);
    this.profileDoc = await this.entrepreneursService.getUserDoc(this.user);
    const formDoc = await this.formService.getFormByCollection(
      FormCollections.entrepreneurs
    );
    this.form = formDoc.find(() => true);
    const components = this.formService.getFormComponents(this.form);
    this.fields = this.formService.getInputComponents(components);
  }

  async editProfileDoc() {
    this.toast.loading();
    const subscription = await this.formService.createFormSubscription({
      form: this.form._id,
      reason: `Editar datos de perfil del usuario ${this.user._id}`,
      data: {},
      doc: this.profileDoc._id,
    });
    this.toast.clear();
    const ref = this.formService.openFormFromSubscription(
      subscription,
      `Editar perfil`
    );
    ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe(async (doc) => {
      if (doc) {
        this.profileDoc = this.user.isExpert
          ? await this.expertsService.getUserDoc(this.user)
          : await this.entrepreneursService.getUserDoc(this.user);
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

  saveConfigChanges() {
    this.userService.updateUserConfig(this.userConfig._id, this.userConfig);
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

  valueFieldMultiple(values: string[], text: Record<string, any>) {
    return textField(values, text);
  }
}
