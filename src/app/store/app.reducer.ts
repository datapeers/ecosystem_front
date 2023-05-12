import { ActionReducerMap } from '@ngrx/store';
import * as fromHome from '@home/store/home.reducer';
import * as fromAuth from '@auth/store/auth.reducer';
import * as fromPhase from '@phase/store/phase.reducer';
import * as fromAnnouncement from '@announcement/store/announcement.reducer';

export interface AppState {
  home: fromHome.IHomeState;
  auth: fromAuth.IAuthState;
  phase: fromPhase.IPhaseState;
  announcement: fromAnnouncement.IAnnouncementState,
}

export const appReducers: ActionReducerMap<AppState> = {
  home: fromHome.homeReducer,
  auth: fromAuth.authReducer,
  phase: fromPhase.phaseReducer,
  announcement: fromAnnouncement.announcementReducer,
};
