import { LogicOperator } from "./logic-operator.enum";
import { MatchMode } from "./match-mode.enum";

export class FieldFilter {
  operator: LogicOperator;
  operations: FilterOperation[];
}

class FilterOperation {
  field: string;
  value: any;
  matchMode: MatchMode;
}
