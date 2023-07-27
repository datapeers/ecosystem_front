import { TableJoin } from "./table-join";
import { TableFilters } from "./table-filters";

export type TableContext = {
  locator: string;
  form: string;
  name: string;
  data?: any;
  joins?: TableJoin[];
  defaultFilters?: TableFilters;
}