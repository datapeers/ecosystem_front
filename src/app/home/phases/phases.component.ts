import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBuilding,
  faUser,
  faUserTie,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { PhasesService } from './phases.service';
import { Subscription, filter, first, firstValueFrom, takeUntil } from 'rxjs';
import { Stage } from './model/stage.model';
import { Phase } from './model/phase.model';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PhasesCreatorComponent } from './phases-creator/phases-creator.component';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { Permission } from '@auth/models/permissions.enum';
import { NoBtnReturn } from '@home/store/home.actions';
@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
})
export class PhasesComponent implements OnInit, OnDestroy {
  loading = true;
  list = [];
  selected;
  actions = [
    {
      action: 'edit',
      label: 'Ver mas',
      icon: 'pi pi-pencil',
      class: '',
    },
  ];
  faBuilding = faBuilding;
  faUser = faUser;
  faUsers = faUsers;
  faUserTie = faUserTie;
  phases$: Subscription;
  phases: Phase[] = [];

  stages$: Subscription;
  stages: Stage[] = [];

  dialogRef;
  onCloseDialogSub$: Subscription;
  activeIndex = 0;

  user: User;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private store: Store<AppState>,
    public dialogService: DialogService,
    private readonly service: PhasesService,
    private readonly toast: ToastService,
    private router: Router
  ) {
    this.store.dispatch(new NoBtnReturn());
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
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
            this.loading = true;
            const phasesBase = phasesList.filter((i) => i.basePhase);
            this.list = [];
            for (const iterator of phasesBase) {
              const docs = phasesList.filter(
                (i) => i.childrenOf === iterator._id
              );
              this.list.push({
                base: iterator,
                label: iterator.name,
                docs,
              });
            }
            this.loading = false;
          }))
      )
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar fases',
          detail: err,
          life: 12000,
        });
        this.phases = [];
        this.loading = false;
      });
  }

  openCreator(phase: Phase) {
    this.dialogRef = this.dialogService.open(PhasesCreatorComponent, {
      header: `Crear batch para ${phase.name}`,
      width: '75vw',
      height: '70vh',
      data: {
        stages: this.stages,
        basePhase: false,
        childrenOf: phase._id,
      },
    });

    this.onCloseDialogSub$ = this.dialogRef.onClose.subscribe(async (data) => {
      this.onCloseDialogSub$.unsubscribe();
      this.dialogRef = null;
    });
  }

  onAction(event: { mouseEvent: MouseEvent; action: any; phase: Phase }) {
    switch (event.action.action) {
      case 'manage':
        break;
      case 'edit':
        this.openPhaseEdit(event.phase);
        break;
    }
  }

  openPhaseEdit(phase: Phase) {
    this.router.navigate([`/home/phases/${phase._id}/edit`]);
  }
}
