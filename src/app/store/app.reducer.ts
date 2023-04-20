import { ActionReducerMap } from '@ngrx/store';
import * as fromHome from '@home/store/home.reducer';
import * as fromAuth from '@auth/store/auth.reducer';
import * as fromPhase from '@phase/store/phase.reducer';

export interface AppState {
  home: fromHome.IHomeState;
  auth: fromAuth.IAuthState;
  phase: fromPhase.IPhaseState;
}

export const appReducers: ActionReducerMap<AppState> = {
  home: fromHome.homeReducer,
  auth: fromAuth.authReducer,
  phase: fromPhase.phaseReducer,
};
