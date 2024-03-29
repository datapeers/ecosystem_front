import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhasesService } from '../phases.service';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { PhasesCreatorComponent } from '../phases-creator/phases-creator.component';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Phase } from '../model/phase.model';
import { ToastService } from '@shared/services/toast.service';
import { Stage, newStage } from '../model/stage.model';
import { cloneDeep } from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-phases-config',
  templateUrl: './phases-config.component.html',
  styleUrls: ['./phases-config.component.scss'],
})
export class PhasesConfigComponent implements OnInit, OnDestroy {
  selectedPhase;
  faReply = faReply;
  phases: Phase[] = [];

  dialogRef;
  onCloseDialogSub$: Subscription;
  phases$: Subscription;
  stages$: Subscription;
  loaded = false;
  showStages = false;
  showStageCreator = false;
  newStage: FormGroup;
  stages: Stage[] = [];
  showedStages: { [s: string]: Stage } = {};
  clonedStages: { [s: string]: Stage } = {};
  stagesUsed: Set<String>;

  user: User;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private store: Store<AppState>,
    private service: PhasesService,
    private router: Router,
    private _location: Location,
    public dialogService: DialogService,
    private toast: ToastService,
    private confirmationService: ConfirmationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onCloseDialogSub$?.unsubscribe();
    this.phases$?.unsubscribe();
    this.stages$?.unsubscribe();
  }

  loadComponent() {
    // --- LOAD STAGES ------------------
    this.service
      .watchStages()
      .then((stages$) => {
        this.stages$ = stages$.subscribe((stageList) => {
          this.stages = stageList;
          for (const iterator of this.stages)
            this.showedStages[iterator._id] = iterator;
          this.newStage = newStage(this.stages.length);
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar etapas',
          detail: err,
          life: 12000,
        });
        this.stages = [];
      });
    // --- LOAD PHASES -------------------
    this.service
      .watchPhases()
      .then(
        (obsPhases$) =>
          (this.phases$ = obsPhases$.subscribe((phasesList: Phase[]) => {
            this.loaded = false;
            this.phases = phasesList.filter((i) => i.basePhase);
            this.stagesUsed = new Set();
            for (const iterator of phasesList) {
              if (!this.stagesUsed.has(iterator.stage))
                this.stagesUsed.add(iterator.stage);
            }
            this.loaded = true;
          }))
      )
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar fases',
          detail: err,
          life: 12000,
        });
        this.phases = [];
        this.loaded = true;
      });
  }

  openPhaseEdit(phase: Phase) {
    this.router.navigate([`/home/phases/${phase._id}/edit`]);
  }

  return() {
    this._location.back();
  }

  resetCreator() {
    this.showStageCreator = false;
    this.newStage = newStage(this.stages.length);
  }

  openCreator() {
    this.dialogRef = this.dialogService.open(PhasesCreatorComponent, {
      header: 'Creador de fase',
      width: '75vw',
      height: '70vh',
      data: {
        stages: this.stages,
        basePhase: true,
      },
    });
    this.onCloseDialogSub$ = this.dialogRef.onClose.subscribe(async (data) => {
      this.onCloseDialogSub$.unsubscribe();
      this.dialogRef = null;
    });
  }

  async showDialogStages() {
    this.showStages = true;
  }

  createStage() {
    this.toast.info({ detail: '', summary: 'Creando' });
    this.service
      .createStage(this.newStage.value)
      .then((ans) => {
        this.toast.clear();
        this.resetCreator();
      })
      .catch(console.warn);
  }

  onStageEditInit(stage: Stage) {
    this.clonedStages[stage._id] = cloneDeep(stage);
  }

  onStageEditSave(stageToEdit: Stage, index: number) {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateStage(stageToEdit.toSave())
      .then((ans) => {
        this.toast.clear();
        this.stages[index] = stageToEdit;
        this.toast.success({
          detail: 'La etapa se edito exitosamente',
          summary: 'Etapa editada!',
          life: 2000,
        });
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar etapa',
          detail: err,
          life: 12000,
        });
        this.onStageEditCancel(stageToEdit, index);
      });
  }

  onStageEditCancel(stage: Stage, index: number) {
    this.stages[index] = this.clonedStages[stage._id];
    delete this.clonedStages[stage._id];
  }

  stageDelete(stage: Stage) {
    if (this.stagesUsed.has(stage._id)) {
      this.toast.alert({
        summary: 'Etapa en uso',
        detail:
          'No se puede eliminar esta etapa, ya que una o varias fases la utilizan actualmente como etapa.',
        life: 3000,
      });
      return;
    }
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que desea continuar?',
      message: '¿Está seguro de que desea eliminar esta etapa?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteStage(stage._id)
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'La etapa ha sido eliminado exitosamente',
              summary: 'Etapa eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar etapa',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  onStageUpIndex(stageToEdit: Stage, index: number) {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateStageIndex(index + 1, stageToEdit._id, 'up')
      .then((ans) => {
        this.toast.clear();
        this.stages[index] = cloneDeep(ans);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar etapa',
          detail: err,
          life: 12000,
        });
      });
  }

  onStageDownIndex(stageToEdit: Stage, index: number) {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateStageIndex(index - 1, stageToEdit._id, 'down')
      .then((ans) => {
        this.toast.clear();
        this.stages[index] = cloneDeep(ans);
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar etapa',
          detail: err,
          life: 12000,
        });
      });
  }
}
