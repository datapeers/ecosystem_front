import { ColumnGroup } from "./column-group";
import { TableColumns } from "./table-config";
import { TableJoin } from "./table-join";

export class DynamicTable {
  _id: string;
  form: string;
  locator: string;
  columns: TableColumns;
  columnGroups: ColumnGroup[];
  joins?: TableJoin[];

  public static fromJson(data: any): DynamicTable {
    const table = new DynamicTable();
    Object.assign(table, data);
    return table;
  }
}