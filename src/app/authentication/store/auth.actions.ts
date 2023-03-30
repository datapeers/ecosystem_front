import { Action } from '@ngrx/store';
import { User } from '@shared/models/user';

export const LOGIN = '[Auth] Login attempt';
export const LOGOUT_USER = '[Auth] Logout attempt';
export const LOGIN_FAIL_USER = '[Auth] Login Fail';
export const LOGIN_SUCCESS_USER = '[Auth] Login success';
export const LOGOUT_FINISHED_USER = '[Auth] Logout finished';
export const SET_USER = '[Auth] Set user';
export const CLEAR_ERROR = '[Auth] Clear error of store';
export const SET_ERROR = '[Auth] Set error in store';
export const CLEAR_STORE = '[Auth] Clear store of auth';
export const SET_INSTITUTE_INFO = '[Auth] Set information about institute';
export const ATTEMPT_INSTITUTE_INFO =
  '[Auth] Attempt to change information about institute';
export const ATTEMPT_INSTITUTE_FAIL =
  '[Auth] Failed attempt to change information about institute';

export class LoginAction implements Action {
  readonly type = LOGIN;

  constructor(public name: string, public password: string) {}
}

export class LogoutAction implements Action {
  readonly type = LOGOUT_USER;
}

export class LogoutFinishedAction implements Action {
  readonly type = LOGOUT_FINISHED_USER;
}

export class LoginFailAction implements Action {
  readonly type = LOGIN_FAIL_USER;

  constructor(public error: any, public extraData?: any) {}
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS_USER;
}

export class SetUserAction implements Action {
  readonly type = SET_USER;

  constructor(public user: User) {}
}

export class SetErrorAction implements Action {
  readonly type = SET_ERROR;

  constructor(public error: any) {}
}

export class ClearStoreAction implements Action {
  readonly type = CLEAR_STORE;
}

export class ClearErrorAction implements Action {
  readonly type = CLEAR_ERROR;
}

export class AttemptInstituteInfoFailAction implements Action {
  readonly type = ATTEMPT_INSTITUTE_FAIL;

  constructor(public error: any) {}
}

export type AuthActions =
  | LoginAction
  | LogoutAction
  | LogoutFinishedAction
  | LoginFailAction
  | LoginSuccessAction
  | SetUserAction
  | SetErrorAction
  | ClearErrorAction
  | ClearStoreAction
  | AttemptInstituteInfoFailAction;
