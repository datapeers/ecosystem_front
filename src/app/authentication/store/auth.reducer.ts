import { User } from '@shared/models/user';
import * as fromAuth from './auth.actions';
export interface IAuthState {
  user: User;
  loaded: boolean;
  logged: boolean;
}

const initialState: IAuthState = {
  user: null,
  loaded: false,
  logged: false,
};

export function authReducer(
  state = initialState,
  action: fromAuth.AuthActions
): IAuthState {
  switch (action.type) {
    case fromAuth.SET_USER:
      return {
        ...state,
        user: action.user,
        loaded: true,
        logged: true,
      };
    case fromAuth.CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
