import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhasesService } from '../phases.service';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { PhasesCreatorComponent } from '../phases-creator/phases-creator.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Phase } from '../model/phase.model';
import { ToastService } from '@shared/services/toast.service';
import { Stage } from '../model/stage.model';
import { cloneDeep } from 'lodash';
import { ConfirmationService } from 'primeng/api';
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
  stages: Stage[] = [];
  showedStages: { [s: string]: Stage } = {};
  clonedStages: { [s: string]: Stage } = {};
  stagesUsed: Set<String>;
  constructor(
    private service: PhasesService,
    private router: Router,
    private _location: Location,
    public dialogService: DialogService,
    private toast: ToastService,
    private confirmationService: ConfirmationService
  ) {}

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
      .createStage({
        label: 'new',
        name: 'stage nae',
        color: '#C54927',
      })
      .then((ans) => {
        this.toast.clear();
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
}
