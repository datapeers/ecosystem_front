import { Action } from '@ngrx/store';
import { User } from '@auth/models/user';

export const SET_USER = '[Auth] Set user in store';
export const SET_ERROR = '[Auth] Set error in store';
export const CLEAR_STORE = '[Auth] Clear store of auth';
export const UPDATE_USER_IMAGE = '[Auth] Update user profile image';
export const UPDATE_USER = '[Auth] Update user state';
export const FAIL_UPDATE_USER = '[Auth] Failed to update user';
export const SET_PROFILE_DOC = '[Auth] Set profile doc in store';
export class SetUserAction implements Action {
  readonly type = SET_USER;
  constructor(public user: User) {}
}

export class ClearAuthStoreAction implements Action {
  readonly type = CLEAR_STORE;
}

export class UpdateUserImageAction implements Action {
  readonly type = UPDATE_USER_IMAGE;

  constructor(public imageUrl: string) {}
}

export class UpdateUserAction implements Action {
  readonly type = UPDATE_USER;

  constructor(public updatedUser: User) {}
}

export class FailUpdateUserAction implements Action {
  readonly type = FAIL_UPDATE_USER;

  constructor(public message: string) {}
}

export class SetProfileDocAction implements Action {
  readonly type = SET_PROFILE_DOC;
  constructor(public user: User) {}
}

export type AuthActions =
  | SetUserAction
  | ClearAuthStoreAction
  | UpdateUserImageAction
  | UpdateUserAction
  | FailUpdateUserAction
  | SetProfileDocAction;
