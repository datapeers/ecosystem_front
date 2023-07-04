import { PageRequest } from '@shared/models/requests/page-request';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

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
  selected: TElement[];
  event: Event;
  callbacks: CallbacksTable;
  lazyLoadEvent: LazyLoadEvent;
  pageRequest: PageRequest;
  rawDataTable?: any[];
}

type CallbacksTable = {
  refresh: () => void;
  fullRefresh: () => void;
  clearCache: () => void;
};
