import { Component, OnDestroy, OnInit } from '@angular/core';
import { Stage, newStage } from '../model/stage.model';
import { FormGroup } from '@angular/forms';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { PhasesService } from '../phases.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { cloneDeep } from 'lodash';
import { ConfirmationService } from 'primeng/api';

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

  user: User;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private store: Store<AppState>,
    private service: PhasesService,
    private router: Router,
    private toast: ToastService,
    private confirmationService: ConfirmationService
  ) {}

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
        // this.onStageEditCancel(stageToEdit, index);
      });
  }

  // onStageEditCancel(stage: Stage, index: number) {
  //   this.stages[index] = this.clonedStages[stage._id];
  //   delete this.clonedStages[stage._id];
  // }

  stageDelete(stage: Stage) {
    // if (this.stagesUsed.has(stage._id)) {
    //   this.toast.alert({
    //     summary: 'Etapa en uso',
    //     detail:
    //       'No se puede eliminar esta etapa, ya que una o varias fases la utilizan actualmente como etapa.',
    //     life: 3000,
    //   });
    //   return;
    // }
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

  resetCreator() {
    this.showStageCreator = false;
    this.newStage = newStage(this.stages.length);
  }
}
