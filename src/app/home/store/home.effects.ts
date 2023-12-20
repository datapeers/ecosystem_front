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
        if (action.profile['startups'].length === 0)
          return new fromHome.SetCurrentBatch('without batch');
        const userPhases = await this.phasesService.getPhasesList(
          action.profile['startups'][0].phases.map((i) => i._id),
          true
        );
        const batches = userPhases.filter((i) => !i.basePhase);

        const currentBatchID = sessionStorage.getItem('currentBatch');
        let currentBatch = batches.find((i) => i._id === currentBatchID);
        if (!currentBatchID || !currentBatch) {
          // Obtén la fecha actual
          const fechaHoy = new Date();
          // Utiliza reduce para encontrar el primer elemento que cumpla la condición
          const resultado = batches.reduce((anterior, actual) => {
            const fechaInicio = actual.startAt;
            const fechaFin = actual.calcEndDate;

            // Comprueba si la fecha de hoy está dentro del rango de fechas
            if (fechaInicio <= fechaHoy && fechaHoy <= fechaFin) {
              return actual; // Elemento que cumple la condición
            }
            // Comprueba si la fecha de fin es más cercana a la fecha de hoy que la fecha de fin del elemento anterior
            if (
              fechaFin < fechaHoy &&
              (!anterior || fechaFin > anterior.calcEndDate)
            ) {
              return actual; // Elemento con fechaFin más cercana
            }
            return anterior; // Si no se cumple ninguna condición, devuelve el elemento anterior
          }, null);
        }
        if (currentBatch) return new fromHome.SetCurrentBatch(currentBatch);
        currentBatch = batches[batches.length - 1];
        if (currentBatch) return new fromHome.SetCurrentBatch(currentBatch);
        return new fromHome.SetCurrentBatch('without batch');
      })
    )
  );
}
