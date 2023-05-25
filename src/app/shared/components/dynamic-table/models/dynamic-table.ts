import { TableColumns } from "./table-config";

export class DynamicTable {
  _id: string;
  form: string;
  locator: string;
  columns: TableColumns;

  public static fromJson(data: any): DynamicTable {
    const table = new DynamicTable();
    Object.assign(table, data);
    return table;
  }
}