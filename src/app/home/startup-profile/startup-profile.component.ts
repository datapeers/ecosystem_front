import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { Subject, first, firstValueFrom, take, takeUntil, tap } from 'rxjs';
import { FormService } from '../../shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { Table } from 'primeng/table';
import { RolStartup, rolStartupNames } from './models/rol-startup.enum';
import { textField } from '@shared/utils/order-field-multiple';
import { cloneDeep } from 'lodash';
import { Phase } from '@home/phases/model/phase.model';
import { UserService } from '@auth/user.service';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';

@Component({
  selector: 'app-startup-profile',
  templateUrl: './startup-profile.component.html',
  styleUrls: ['./startup-profile.component.scss'],
})
export class StartupProfileComponent implements OnInit, OnDestroy {
  user: User;
  loaded = false;
  profileDoc;
  startup: Startup;
  formStartup;
  formNegociosFields = [];
  noValuePlaceholder: string = '- - - -';
  textSummary = `Visualizando {first} a {last} de {totalRecords} entradas`;
  onDestroy$: Subject<void> = new Subject();
  leaderStartup;
  editEntrepreneur;

  canInvite;
  showDialogInvite;
  invite = '';
  currentBatch: Phase | any;
  saving = false;
  thumbnail;
  @ViewChild('dt', { static: true }) dt: Table;

  public get rolStartups(): typeof RolStartup {
    return RolStartup;
  }

  public get rolStartupsNames(): typeof rolStartupNames {
    return rolStartupNames;
  }

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private startupService: StartupsService,
    private formService: FormService,
    private userService: UserService,
    private storageService: StorageService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.loaded = false;
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    const startup = this.profileDoc.startups[0];
    this.startup = await this.startupService.getDocument(startup._id);
    this.leaderStartup = this.startup.entrepreneurs.find(
      (i) => i.rol === 'leader'
    );
    const formsStartups = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!formsStartups.length) {
      return;
    }
    this.formStartup = formsStartups.find(() => true);
    const formNegociosComponents = this.formService.getFormComponents(
      this.formStartup
    );
    const ignore = ['nombre', 'descripcion'];
    this.formNegociosFields = this.formService
      .getInputComponents(formNegociosComponents)
      .filter((i) => !ignore.includes(i.key));
    // console.log(this.formNegociosFields);
    this.currentBatch = await firstValueFrom(
      this.store
        .select((store) => store.home.currentBatch)
        .pipe(first((i) => i !== null))
    );
    if (
      this.currentBatch &&
      this.currentBatch['childrenOf'] === '65242ea3baa24cae19bd5baf'
    ) {
      this.canInvite = true;
    }
    this.loaded = true;
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Pagina ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }

  async editStartup() {
    this.toast.loading();
    const subscription = await this.formService.createFormSubscription({
      form: this.formStartup._id,
      reason: 'Editar startup',
      data: {},
      doc: this.startup._id,
    });
    this.toast.clear();
    const ref = this.formService.openFormFromSubscription(
      subscription,
      'Editar startup'
    );
    ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe(async (doc) => {
      if (doc) {
        this.startup = await this.startupService.getDocument(this.startup._id);
      }
    });
  }

  valueFieldMultiple(values: string[], text: Record<string, any>) {
    return textField(values, text);
  }

  editDataEntrepreneur(data) {
    this.editEntrepreneur = cloneDeep(data);
    // updateDataEntrepreneur;
  }

  async saveDataEntrepreneur() {
    this.toast.info({
      summary: 'Guardando cambios',
      detail: 'por favor espere',
      life: 120000000,
    });
    try {
      await this.startupService.updateDataEntrepreneur(
        this.editEntrepreneur['_id'],
        this.editEntrepreneur['description'],
        this.editEntrepreneur['rol'],
        this.startup._id
      );
      this.startup = await this.startupService.getDocument(this.startup._id);
      this.toast.clear();
      this.closeDataEntrepreneur();
    } catch (error) {
      this.toast.clear();
      this.toast.error({
        summary: 'Error al intentar cambiar datos',
        detail: error,
        life: 10000,
      });
    }
  }

  closeDataEntrepreneur() {
    this.editEntrepreneur = undefined;
  }

  inviteDialog() {
    this.showDialogInvite = true;
  }

  async inviteToStartup() {
    this.saving = true;
    this.toast.info({ summary: 'Invitando...', detail: '', life: 12000000 });
    try {
      await this.userService.inviteUserStartup(
        'aaaaaaaaaaa',
        this.user.fullName,
        `Forma parte de ${this.startup.item['nombre']} en EcosystemBT`,
        this.invite,
        this.startup._id,
        this.startup.item['nombre']
      );
      this.toast.clear();
      this.showDialogInvite = false;
      this.invite = '';
      this.saving = false;
      this.toast.success({ summary: 'Invitación enviada', detail: '' });
    } catch (error) {
      this.saving = false;
      this.toast.error({ summary: 'Error al invitar', detail: error });
    }
  }

  async uploadImage(fileToUpload: File) {
    this.toast.info({
      summary: 'Subiendo imagen...',
      detail: 'Por favor espere',
      life: 10000,
    });
    this.startupService
      .updateStartupThumbnail(this.startup, fileToUpload)
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
          this.startupService
            .updateThumbnailDB(this.startup._id, realUrl)
            .then(async (phase) => {
              this.toast.clear();
              this.startup = await this.startupService.getDocument(
                this.startup._id
              );
            })
            .catch((err) => {
              this.toast.clear();
              this.toast.error({
                detail: err,
                summary: 'Error al cambiar imagen de startup',
              });
            });
        }
      });
  }

  returnUrlThumbnail(): string {
    return this.startup.thumbnail;
  }
}
