import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as fromPhase from './phase.actions';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { PhasesService } from '../phases.service';

@Injectable()
export class PhaseEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private phasesService: PhasesService,
  ) {}

  updatePhaseImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPhase.UPDATE_PHASE_IMAGE),
      switchMap(async (action: fromPhase.UpdatePhaseImageAction) => {
        const user = await firstValueFrom(this.store.select(state => state.phase.phase));
        const imageUrl = action.imageUrl;
        var result = await this.phasesService.updatePhase(user._id, { thumbnail: imageUrl })
        .then(updatedPhase => {
          return new fromPhase.UpdatePhaseAction(updatedPhase);
        })
        .catch(ex => {
          return new fromPhase.FailUpdatePhaseAction("Failed to update user profile image");
        });
        return result;
      })
    )
  );
}
