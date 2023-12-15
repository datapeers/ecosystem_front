import { IMenu } from '@shared/models/menu';
import * as fromHome from './home.actions';
import { Phase } from '@home/phases/model/phase.model';
import { Content } from '@home/phases/model/content.model';

export interface IHomeState {
  menuExpanded: boolean;
  loading: boolean;
  menu: IMenu;
  otherMenu: IMenu;
  subMenus: IMenu[];
  breadcrumb: string[];
  currentBatch: Phase | 'without batch' | null;
  returnBtn: boolean;
  lastContent: {
    lastContent: Content;
    contentCompleted: number;
    numberOfContent: number;
  };
}

const initialState: IHomeState = {
  menuExpanded: true,
  loading: false,
  menu: null,
  otherMenu: null,
  subMenus: null,
  breadcrumb: [],
  currentBatch: null,
  returnBtn: false,
  lastContent: null,
};

export function homeReducer(
  state = initialState,
  action: fromHome.HomeActions
): IHomeState {
  switch (action.type) {
    case fromHome.TOGGLE_MENU:
      return { ...state, menuExpanded: !state.menuExpanded };
    case fromHome.SET_MENU:
      return { ...state, menu: action.newMenu };
    case fromHome.SET_OTHER_MENU:
      return { ...state, otherMenu: action.menu };
    case fromHome.SET_SUB_MENU:
      return { ...state, subMenus: action.menus };
    case fromHome.RESTORE_MENU:
      return { ...state, otherMenu: null };
    case fromHome.SET_BREADCRUMB:
      return { ...state, breadcrumb: action.breadcrumb };
    case fromHome.RESTORE_BREADCRUMB:
      return { ...state, breadcrumb: [] };
    case fromHome.SET_CURRENT_BATCH:
      if (action.batch && action.batch !== 'without batch') {
        localStorage.setItem('currentBatch', action.batch._id);
      } else {
        localStorage.setItem('currentBatch', '');
      }
      return { ...state, currentBatch: action.batch };
    case fromHome.ACTIVATE_RETURN:
      return { ...state, returnBtn: true };
    case fromHome.NO_RETURN:
      return { ...state, returnBtn: false };
    case fromHome.SET_LAST_CONTENT_REQ:
      return { ...state, lastContent: action.lastContent };
    case fromHome.SET_LAST_CONTENT:
      return {
        ...state,
        lastContent: { ...state.lastContent, lastContent: action.lastContent },
      };
    default:
      return { ...state };
  }
}
