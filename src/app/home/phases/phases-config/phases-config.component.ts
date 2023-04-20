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

@Component({
  selector: 'app-phases-config',
  templateUrl: './phases-config.component.html',
  styleUrls: ['./phases-config.component.scss'],
})
export class PhasesConfigComponent implements OnInit, OnDestroy {
  selectedPhase;
  faReply = faReply;
  fases = [];

  dialogRef;
  onCloseDialogSub$: Subscription;
  phases$: Subscription;
  loading = true;
  constructor(
    private service: PhasesService,
    private router: Router,
    private _location: Location,
    public dialogService: DialogService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onCloseDialogSub$?.unsubscribe();
    this.phases$?.unsubscribe();
  }

  loadComponent() {
    this.service
      .watchPhases()
      .then(
        (obsPhases$) =>
          (this.phases$ = obsPhases$.subscribe((phasesList) => {
            this.loading = true;
            this.fases = phasesList.filter((i) => i.basePhase);
            this.loading = false;
          }))
      )
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar fases',
          detail: err,
          life: 12000,
        });
        this.fases = [];
        this.loading = false;
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
      width: '70vw',
      height: '70vh',
      data: {},
    });

    this.onCloseDialogSub$ = this.dialogRef.onClose.subscribe(async (data) => {
      this.onCloseDialogSub$.unsubscribe();
      this.dialogRef = null;
    });
  }
}
