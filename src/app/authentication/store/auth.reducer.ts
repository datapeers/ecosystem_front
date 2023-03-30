import { User } from '@shared/models/user';
import * as fromAuth from './auth.actions';
export interface IAuthState {
  user: User;
  loaded: boolean;
  logged: boolean;
  error: any;
  extraData: any;
}

const initialState: IAuthState = {
  user: null,
  loaded: false,
  logged: false,
  error: null,
  extraData: null,
};

export function authReducer(
  state = initialState,
  action: fromAuth.AuthActions
): IAuthState {
  switch (action.type) {
    case fromAuth.LOGIN:
      return { ...state };
    case fromAuth.LOGOUT_USER:
      return { ...state };
    case fromAuth.LOGOUT_FINISHED_USER:
      return { ...initialState };
    case fromAuth.LOGIN_FAIL_USER:
      return {
        ...state,
        loaded: false,
        error: action.error.message,
        extraData: action.extraData,
      };
    case fromAuth.SET_USER:
      return {
        ...state,
        user: action.user,
        loaded: true,
        logged: true,
        error: null,
      };
    case fromAuth.LOGIN_SUCCESS_USER:
      return { ...state, loaded: true, error: null };
    case fromAuth.SET_ERROR:
      return { ...state, error: action.error };
    case fromAuth.CLEAR_ERROR:
      return { ...state, error: null, extraData: null };
    case fromAuth.CLEAR_STORE:
      return { ...initialState };
    case fromAuth.ATTEMPT_INSTITUTE_FAIL:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
