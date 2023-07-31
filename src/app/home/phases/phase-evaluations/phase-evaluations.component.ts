import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { PhaseEvaluationsService } from './phase-evaluations.service';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import {
  ConfigEvaluation,
  newConfigEvaluation,
} from './models/evaluation-config';
import { Permission } from '@auth/models/permissions.enum';
import { ValidRoles, rolesListApp } from '@auth/models/valid-roles.enum';
import { FormGroup } from '@angular/forms';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { ConfirmationService } from 'primeng/api';
import { Phase } from '../model/phase.model';

@Component({
  selector: 'app-phase-evaluations',
  templateUrl: './phase-evaluations.component.html',
  styleUrls: ['./phase-evaluations.component.scss'],
})
export class PhaseEvaluationsComponent implements OnInit, OnDestroy {
  loaded = false;
  user: User;
  phase: Phase;
  configEvaluations$: Subscription;
  configEvaluationList: ConfigEvaluation[] = [];
  showCreatorEvaluation = false;
  newConfigEvaluation: FormGroup;

  canBeEvaluated = [];
  canBeReviewer = [];

  forms = [];
  reviewers = [];
  evaluated = [];

  saving = false;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private store: Store<AppState>,

    private readonly toast: ToastService,
    private readonly formService: FormService,
    private readonly service: PhaseEvaluationsService,
    private confirmationService: ConfirmationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
    this.newConfigEvaluation = newConfigEvaluation(null);
    this.reviewers = rolesListApp.filter((i) =>
      this.canBeReviewer.includes(i.value)
    );
    this.evaluated = rolesListApp.filter((i) =>
      this.canBeEvaluated.includes(i.value)
    );
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.configEvaluations$?.unsubscribe();
  }

  async loadComponent() {
    this.loaded = true;
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    this.setCanBeReviewerAndEvaluated();
    this.newConfigEvaluation = newConfigEvaluation(this.phase._id);
    this.service
      .watchConfigsEvaluations(this.phase._id)
      .then((configEvaluations$) => {
        this.configEvaluations$ = configEvaluations$.subscribe(
          (configList: ConfigEvaluation[]) => {
            this.configEvaluationList = configList.filter((x) => !x.isDeleted);
          }
        );
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar configuración de evaluaciones',
          detail: err,
          life: 12000,
        });
        this.configEvaluationList = [];
      });
  }

  async openCreator(config?: ConfigEvaluation) {
    this.toast.loading();
    if (!this.forms.length) {
      this.forms = (
        await this.formService.getFormByCollection(FormCollections.evaluations)
      ).map((form) => ({ id: form._id, label: form.name }));
    }
    this.toast.clear();
    if (config)
      this.newConfigEvaluation = newConfigEvaluation(this.phase._id, config);
    this.showCreatorEvaluation = true;
  }

  resetCreator() {
    this.showCreatorEvaluation = false;
    this.newConfigEvaluation = newConfigEvaluation(this.phase._id, null);
  }

  createConfig() {
    this.toast.loading();
    this.saving = true;
    this.service
      .createConfigsEvaluation(this.newConfigEvaluation.value)
      .then((ans) => {
        this.toast.clear();
        this.resetCreator();
        this.saving = false;
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({
          summary: 'Error al intentar crear evaluación',
          detail: err,
        });
        this.saving = false;
      });
  }

  saveEditConfig() {
    this.toast.loading();
    this.saving = true;
    this.service
      .updateConfigsEvaluation(this.newConfigEvaluation.value)
      .then((ans) => {
        this.toast.clear();
        this.resetCreator();
        this.saving = false;
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({
          summary: 'Error al intentar crear evaluación',
          detail: err,
        });
        this.saving = false;
      });
  }

  deleteConfig(config: ConfigEvaluation) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere continuar?',
      message: '¿Está seguro de que desea eliminar este evaluación?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteConfigEvaluation(config._id)
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'La evaluación ha sido eliminado exitosamente',
              summary: 'Tipo de evento eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar la evaluación',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  setCanBeReviewerAndEvaluated() {
    switch (this.user.rolType) {
      case ValidRoles.teamCoach:
        this.canBeEvaluated = [ValidRoles.user];
        this.canBeReviewer = [ValidRoles.teamCoach];
        break;
      case ValidRoles.expert:
        this.canBeEvaluated = [ValidRoles.user];
        this.canBeReviewer = [ValidRoles.expert];
        break;
      default:
        this.canBeEvaluated = [
          ValidRoles.user,
          ValidRoles.teamCoach,
          ValidRoles.expert,
        ];
        this.canBeReviewer = [
          ValidRoles.host,
          ValidRoles.teamCoach,
          ValidRoles.expert,
        ];
        break;
    }
  }
}
