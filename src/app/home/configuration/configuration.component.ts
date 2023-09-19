import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { firstValueFrom, first, Subscription } from 'rxjs';
import { User } from '@auth/models/user';
import { ConfigurationApp } from './model/configurationApp';
import { configTinyMce } from '@shared/models/configTinyMce';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '@shared/services/toast.service';
import { FormGroup } from '@angular/forms';
import { newVertical } from './model/vertical';
import { cloneDeep } from 'lodash';
import { newBenefactor } from './model/benefactor';
import { newInterestContent } from './model/interest-content';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  user: User;
  configBackup: ConfigurationApp;
  config: ConfigurationApp;
  loaded = false;
  saving = false;
  watchConfig$: Subscription;

  editing: number = undefined;
  enableBtnEdit = false;
  // Creator vertical
  listIconsVerticals = ['leaf', 'affiliate', 'dna-2', 'replace', 'api-app'];
  showCreatorVertical = false;
  newVertical: FormGroup;

  // Creator Benefactor
  showCreatorBenefactor = false;
  newBenefactor: FormGroup;

  // Creator content interest
  showCreatorInterestContent = false;
  newInterestContent: FormGroup;

  get formControlsVertical() {
    return this.newVertical?.controls;
  }

  get formControlsBenefactor() {
    return this.newBenefactor?.controls;
  }

  get formControlsInterestContent() {
    return this.newInterestContent?.controls;
  }

  public get configTiny(): typeof configTinyMce {
    return configTinyMce;
  }

  constructor(
    private store: Store<AppState>,
    private service: ConfigurationService,
    private toast: ToastService,
    private confirmationService: ConfirmationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
    this.newVertical = newVertical();
    this.newBenefactor = newBenefactor();
    this.newInterestContent = newInterestContent();
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.watchConfig$?.unsubscribe();
  }

  async loadComponent() {
    this.watchConfig$ = (await this.service.watchConfig()).subscribe(
      async (i) => {
        this.loaded = false;
        this.config = cloneDeep(i);
        this.configBackup = i;
        this.loaded = true;
      }
    );
  }

  revertChanges() {
    this.config = cloneDeep(this.configBackup);
  }

  saveChanges() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      header: '¿Está usted seguro de que desea guardar los cambios?',
      rejectButtonStyleClass: 'button-grey',
      message:
        'Le recordamos que al proceder con la acción de guardar, dichas modificaciones se actualizarán de manera inmediata y estarán disponibles para todos los usuarios. ¿Desea continuar con esta acción?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.saving = true;
        this.toast.info({ detail: '', summary: 'Guardando...' });
        this.service
          .updateConfig(this.config._id, this.config.save())
          .then((ans) => {
            this.saving = false;
            this.toast.clear();
            this.toast.success({
              detail: '',
              summary: 'Cambios guardados!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.saving = false;
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar guardar cambios',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  // Vertical

  openCreatorVertical(previousIndex?: number) {
    this.newVertical = newVertical(this.config.verticals[previousIndex]);
    this.showCreatorVertical = true;
    this.editing = previousIndex ?? undefined;
    this.enableBtnEdit = previousIndex >= 0 ? true : false;
  }

  resetCreatorVertical() {
    this.showCreatorVertical = false;
  }

  createVertical() {
    this.config.verticals.push(this.newVertical.value);
    this.resetCreatorVertical();
  }

  editVertical() {
    this.config.verticals[this.editing] = {
      ...this.config.verticals[this.editing],
      ...this.newVertical.value,
    };
    this.resetCreatorVertical();
  }

  deleteVertical(index: number) {
    this.config.verticals.splice(index, 1);
  }

  // Benefactor
  openCreatorBenefactor(previousIndex?: number) {
    this.newBenefactor = newBenefactor(this.config.benefactors[previousIndex]);
    this.showCreatorBenefactor = true;
    this.editing = previousIndex ?? undefined;
    this.enableBtnEdit = previousIndex >= 0 ? true : false;
  }

  resetCreatorBenefactor() {
    this.showCreatorBenefactor = false;
  }

  createBenefactor() {
    this.config.benefactors.push(this.newBenefactor.value);
    this.resetCreatorBenefactor();
  }

  editBenefactor() {
    this.config.benefactors[this.editing] = {
      ...this.config.benefactors[this.editing],
      ...this.newBenefactor.value,
    };
    this.resetCreatorBenefactor();
  }

  deleteBenefactor(index: number) {
    this.config.benefactors.splice(index, 1);
  }

  // Content interest
  openCreatorInterestContent(previousIndex?: number) {
    this.newInterestContent = newInterestContent(
      this.config.contentOfInterest[previousIndex]
    );
    this.showCreatorInterestContent = true;
    this.editing = previousIndex ?? undefined;
    this.enableBtnEdit = previousIndex >= 0 ? true : false;
  }

  resetCreatorInterestContent() {
    this.showCreatorInterestContent = false;
  }

  createInterestContent() {
    this.config.contentOfInterest.push(this.newInterestContent.value);
    this.resetCreatorInterestContent();
  }

  editInterestContent() {
    this.config.contentOfInterest[this.editing] = {
      ...this.config.contentOfInterest[this.editing],
      ...this.newInterestContent.value,
    };
    this.resetCreatorInterestContent();
  }

  deleteInterestContent(index: number) {
    this.config.contentOfInterest.splice(index, 1);
  }
}
