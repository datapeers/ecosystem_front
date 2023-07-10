import { TableColumn } from "./table-config";

export interface ColumnGroup {
  name: string;
  key?: string;
  columns: TableColumn[];
}