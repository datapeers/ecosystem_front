import { MenuItem } from 'primeng/api';

export interface TableAction extends MenuItem {
  action?: string;
  class?: string;
  featured?: boolean;
  items?: TableAction[];
  rawDataTable?: any[];
  disableOn?: () => boolean;
}

export interface TableActionEvent<TElement = any, TAction = string> {
  action: TAction;
  element: TElement;
  event: Event;
  callbacks: CallbacksTable;
  rawDataTable?: any[];
}

type CallbacksTable = {
  refresh: () => void;
  fullRefresh: () => void;
  clearCache: () => void;
};
