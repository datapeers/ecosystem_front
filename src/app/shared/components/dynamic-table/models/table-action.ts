import { MenuItem } from 'primeng/api';

export interface TableAction extends MenuItem {
  action: string;
  class: string;
  featured: boolean;
  items: TableAction[];
  rawDataTable?: any[];
}

export interface TableActionEvent<TAction = string> {
  action: string;
  element: any;
  event: Event;
  callbacks: CallbacksTable;
  rawDataTable?: any[];
}

type CallbacksTable = {
  refresh: () => void;
};
