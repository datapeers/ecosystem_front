import { Component, OnDestroy, OnInit } from '@angular/core';
import { Stage, newStage } from '../model/stage.model';
import { FormGroup } from '@angular/forms';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { PhasesService } from '../phases.service';
import { Router } from '@angular/router';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { cloneDeep } from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { ActivateBtnReturn } from '@home/store/home.actions';
@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
})
export class StagesComponent implements OnInit, OnDestroy {
  stages$: Subscription;
  loaded = false;
  showStageCreator = false;
  newStage: FormGroup;
  stages: Stage[] = [];
  stagesObj: Record<string, Stage> = {};
  listIconsStages = [
    'leaf',
    'brand-asana',
    'social',
    'plant',
    'tree',
    'apple',
    'plant-2',
    'seeding',
    'trees',
  ];
  onlyReadForm = false;
  user: User;
  public get userPermission(): typeof Permission {
    return Permission;
  }

  get formControls() {
    return this.newStage.controls;
  }
  constructor(
    private store: Store<AppState>,
    private service: PhasesService,
    private router: Router,

    private toast: ToastService,
    private confirmationService: ConfirmationService
  ) {
    this.store.dispatch(new ActivateBtnReturn());
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
    this.stages$?.unsubscribe();
  }

  loadComponent() {
    // --- LOAD STAGES ------------------
    this.service
      .watchStages()
      .then((stages$) => {
        this.stages$ = stages$.subscribe((stageList) => {
          this.stages = stageList;
          this.stagesObj = {};
          for (const iterator of this.stages) {
            this.stagesObj[iterator._id] = iterator;
          }
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

  onStageEditSave() {
    const stageChanges = Stage.fromJson(this.newStage.value);
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateStage(stageChanges.toSave())
      .then((ans) => {
        this.resetCreator();
        this.toast.clear();
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
        // this.onStageEditCancel(stageToEdit, index);
      });
  }

  // onStageEditCancel(stage: Stage, index: number) {
  //   this.stages[index] = this.clonedStages[stage._id];
  //   delete this.clonedStages[stage._id];
  // }

  stageDelete() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que desea eliminar esta etapa?',
      message:
        'Tenga en cuenta que, al eliminarla, se conservarán los registros de las fases anteriores y otros datos relacionados, pero no podrá utilizar esta etapa en el futuro. ¿Desea continuar?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteStage(this.newStage.get('_id').value)
          .then((ans) => {
            this.resetCreator();
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

  openCreator(stage?: Stage, onlyView?: boolean) {
    this.showStageCreator = true;
    this.newStage = newStage(this.stages.length, stage);
    this.onlyReadForm = onlyView;
    if (this.onlyReadForm) {
      for (const keyControl of Object.keys(this.formControls)) {
        this.newStage.get(keyControl)?.disable();
      }
    }
  }

  resetCreator() {
    this.showStageCreator = false;
  }

  getGradientBackground(stage: Stage): string {
    const style = `linear-gradient(90deg, ${stage.color} 0%, #ffffff 100%)`;
    return style;
  }
}
