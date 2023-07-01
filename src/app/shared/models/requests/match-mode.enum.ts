export enum MatchMode {
  Contains = 'contains',
  NotContains = 'notContains',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  Equals = 'equals',
  NotEquals = 'notEquals',
}

export const parseMatchMode = (matchMode: string): MatchMode => {
  switch (matchMode) {
    default: return MatchMode.Contains;
    case MatchMode.Contains: return MatchMode.Contains;
    case MatchMode.NotContains: return MatchMode.NotContains;
    case MatchMode.StartsWith: return MatchMode.StartsWith;
    case MatchMode.EndsWith: return MatchMode.EndsWith;
    case MatchMode.Equals: return MatchMode.Equals;
    case MatchMode.NotEquals: return MatchMode.NotEquals;
  }
}