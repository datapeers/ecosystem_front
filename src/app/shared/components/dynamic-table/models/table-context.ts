import { TableJoin } from "./table-join";

export type TableContext = {
  locator: string;
  form: string;
  name: string;
  data?: any;
  joins?: TableJoin[];
}