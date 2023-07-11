import { Component } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { PhasesService } from '../phases.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ClearPhaseStoreAction, SetPhaseAction } from '../store/phase.actions';
import { SetOtherMenuAction } from '@home/store/home.actions';
import { RestoreMenuAction } from '@home/store/home.actions';
import { first, firstValueFrom } from 'rxjs';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-phase-load',
  templateUrl: './phase-load.component.html',
  styleUrls: ['./phase-load.component.scss'],
})
export class PhaseLoadComponent {
  phaseId: string;
  user: User;
  constructor(
    private readonly store: Store<AppState>,
    private readonly phasesService: PhasesService,
    private readonly route: ActivatedRoute
  ) {
    this.phaseId = route.snapshot.paramMap.get('id');
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
    this.store.dispatch(new ClearPhaseStoreAction());
    this.store.dispatch(new RestoreMenuAction());
  }

  async loadComponent() {
    const phase = await this.phasesService.getPhase(this.phaseId);
    const menu = await this.phasesService.optionsMenu(phase, this.user);
    this.store.dispatch(new SetPhaseAction(phase));
    this.store.dispatch(new SetOtherMenuAction(menu));
  }
}
