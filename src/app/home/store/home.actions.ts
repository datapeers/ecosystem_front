import { Action } from '@ngrx/store';
// import { IMenuSideBar } from '../models/menu-model';

export const TOGGLE_MENU = '[HomeAction] Toggle menu';
export const LOADING_MENU = '[HomeAction] Change State load of a menu';
export const SET_MENU = '[HomeAction] Set menu';
export const SET_OTHER_MENU = '[HomeAction] Set other menu';
export const RESTORE_MENU = '[HomeAction] Restore main menu';
export const SET_BREADCRUMB = '[HomeAction] Set path of breadcrumb';
export const RESTORE_BREADCRUMB = '[HomeAction] Restore path of breadcrumb';
export class ToggleMenuAction implements Action {
  readonly type = TOGGLE_MENU;

  constructor() {}
}

export class LoadingMenuAction implements Action {
  readonly type = LOADING_MENU;
  constructor(public stateLoad: boolean) {}
}

export class SetMenuAction implements Action {
  readonly type = SET_MENU;

  constructor(public newMenu: any) {}
}

export class SetOtherMenuAction implements Action {
  readonly type = SET_OTHER_MENU;

  constructor(public menu: any) {}
}

export class RestoreMenuAction implements Action {
  readonly type = RESTORE_MENU;

  constructor() {}
}

export class SetBreadcrumbAction implements Action {
  readonly type = SET_BREADCRUMB;

  constructor(public breadcrumb: string[]) {}
}

export class RestoreBreadcrumbAction implements Action {
  readonly type = RESTORE_BREADCRUMB;

  constructor() {}
}

export type HomeActions =
  | ToggleMenuAction
  | SetMenuAction
  | SetOtherMenuAction
  | RestoreMenuAction
  | LoadingMenuAction
  | SetBreadcrumbAction
  | RestoreBreadcrumbAction;
