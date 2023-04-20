import { Component } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { PhasesService } from '../phases.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ClearPhaseStoreAction, SetPhaseAction } from '../store/phase.actions';

@Component({
  selector: 'app-phase-load',
  templateUrl: './phase-load.component.html',
  styleUrls: ['./phase-load.component.scss']
})
export class PhaseLoadComponent {
  phaseId: string;
  constructor(
    private readonly store: Store<AppState>,
    private readonly phasesService: PhasesService,
    private readonly route: ActivatedRoute
  ) {
    this.phaseId = route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearPhaseStoreAction());
  }

  async loadComponent() {
    const phase = await this.phasesService.getPhase(this.phaseId);
    this.store.dispatch(new SetPhaseAction(phase));
  }
}
