import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as fromHome from './home.actions';
import { PhasesService } from '@home/phases/phases.service';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private phasesService: PhasesService
  ) {}

  getCurrentBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromHome.SEARCH_CURRENT_BATCH),
      switchMap(async (action: fromHome.SearchCurrentBatch) => {
        // TODO READ STARTUP SELECTED
        const userPhases = await this.phasesService.getPhasesList(
          action.profile['startups'][0].phases.map((i) => i._id),
          true
        );
        const batches = userPhases.filter((i) => !i.basePhase);
        const currentBatchID = localStorage.getItem('currentBatch');
        let currentBatch = batches.find((i) => i._id === currentBatchID);
        if (!currentBatchID || !currentBatch)
          currentBatch = batches.find((i) =>
            moment(i.endAt).isBefore(new Date())
          );
        if (currentBatch) return new fromHome.SetCurrentBatch(currentBatch);
        currentBatch = batches[batches.length - 1];
        if (currentBatch) return new fromHome.SetCurrentBatch(currentBatch);
        return new fromHome.SetCurrentBatch('without batch');
      })
    )
  );
}
