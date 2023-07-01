
import { FieldSort } from "./field-filter";
import { FieldFilter } from "./field-order";

export interface PageRequest {
  skip: number;
  limit: number;
  globalFilter: FieldFilter;
  sort: FieldSort[];
  filter: FieldFilter[];
  foreignSort: FieldSort[];
  foreignFilter: FieldFilter[];
}
