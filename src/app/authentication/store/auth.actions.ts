import { Action } from '@ngrx/store';
import { User } from '@shared/models/user';

export const SET_USER = '[Auth] Set user';

export const SET_ERROR = '[Auth] Set error in store';
export const CLEAR_STORE = '[Auth] Clear store of auth';

export class SetUserAction implements Action {
  readonly type = SET_USER;

  constructor(public user: User) {}
}

export class ClearAuthStoreAction implements Action {
  readonly type = CLEAR_STORE;
}

export type AuthActions = SetUserAction | ClearAuthStoreAction;
