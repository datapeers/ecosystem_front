export enum LogicOperator {
  And = "and",
  Or = "or",
}

export const parseOperator = (operator: string) => {
  switch(operator) {
    default: return LogicOperator.Or;
    case LogicOperator.Or: return LogicOperator.Or;
    case LogicOperator.And: return LogicOperator.And;
  }
}