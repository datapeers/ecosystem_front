import { TableColumn } from "./table-config";

export interface TableJoin {
  name: string;
  key: string;
  form: string;
  extraColumns?: TableColumn[];
}