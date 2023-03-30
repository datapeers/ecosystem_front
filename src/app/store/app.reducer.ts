import { ActionReducerMap } from '@ngrx/store';
import * as fromHome from '@home/store/home.reducer';
import * as fromAuth from '@auth/store/auth.reducer';

export interface AppState {
  home: fromHome.IHomeState;
  auth: fromAuth.IAuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  home: fromHome.homeReducer,
  auth: fromAuth.authReducer,
};
