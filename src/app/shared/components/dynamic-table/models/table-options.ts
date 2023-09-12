import { TableColumn } from './table-config';

export interface TableOptions {
  save: boolean;
  download: boolean;
  details: boolean;
  showConfigButton: boolean;
  redirect: string;
  selection: boolean;
  actions_row: string;
  actionsPerRow: any[];
  actionsTable: any[];
  extraColumnsTable: TableColumn[];
  summary?: string;
  hideMultipleFiltersTable?: boolean;
}
