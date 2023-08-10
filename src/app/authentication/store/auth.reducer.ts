import { User } from '@auth/models/user';
import * as fromAuth from './auth.actions';
import { Phase } from '@home/phases/model/phase.model';
export interface IAuthState {
  user: User;
  profileDoc: any;
  loaded: boolean;
  logged: boolean;
  currentBatch: Phase;
}

const initialState: IAuthState = {
  user: null,
  profileDoc: null,
  loaded: false,
  logged: false,
  currentBatch: null,
};

export function authReducer(
  state = initialState,
  action: fromAuth.AuthActions
): IAuthState {
  switch (action.type) {
    case fromAuth.SET_USER:
      return {
        ...state,
        user: new User(action.user),
        loaded: true,
        logged: true,
      };
    case fromAuth.UPDATE_USER:
      return {
        ...state,
        user: new User(action.updatedUser),
      };
    case fromAuth.SET_PROFILE_DOC:
      return { ...state, profileDoc: action.doc };
    case fromAuth.CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
