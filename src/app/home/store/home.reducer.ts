import { IMenu } from '@shared/models/menu';
import * as fromHome from './home.actions';

export interface IHomeState {
  menuExpanded: boolean;
  loading: boolean;
  menu: IMenu;
  breadcrumb: string[];
}

const initialState: IHomeState = {
  menuExpanded: true,
  loading: false,
  menu: null,
  breadcrumb: [],
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
    case fromHome.RESTORE_MENU:
      return { ...state, menu: null };
    case fromHome.SET_BREADCRUMB:
      return { ...state, breadcrumb: action.breadcrumb };
    case fromHome.RESTORE_BREADCRUMB:
      return { ...state, breadcrumb: [] };
    default:
      return { ...state };
  }
}
