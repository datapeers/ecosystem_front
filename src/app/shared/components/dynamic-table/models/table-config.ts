import { TableLazyLoadEvent } from './lazy-load';

export interface ITableConfig {
  _id: string;
  name: string;
  columns: TableColumns;
  loadEvent?: TableLazyLoadEvent;
}

export class TableConfig implements ITableConfig {
  _id: string;
  loadEvent?: TableLazyLoadEvent;
  name: string;
  columns: TableColumns;

  public static fromJson(data: any): TableConfig {
    const table = new TableConfig();
    Object.assign(table, data);
    return table;
  }
}

export type TableColumns = TableColumn[];
export type TableColumn = {
  label: string;
  key: string;
  type: TableColumnType;
  format: TableCellFormat;
  propConditionalClass?: { prop?: string; class?: any };
  booleanText?: { true: string; false: string };
};

export enum TableColumnType {
  data = 'data',
  array = 'array',
  img = 'img',
}

type TableCellFormat =
  | 'string'
  | 'url'
  | 'number'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'dateAndTime'
  | 'time'
  | 'image';
