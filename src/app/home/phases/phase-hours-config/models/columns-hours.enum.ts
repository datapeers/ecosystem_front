export enum columnsHours {
  allocated = 'allocated',
  donated = 'donated',
  done = 'done',
}

export const columnsHoursLabels: Record<columnsHours, string> = {
  [columnsHours.allocated]: 'Horas asignadas',
  [columnsHours.donated]: 'Horas donadas',
  [columnsHours.done]: 'Horas realizadas',
};

export interface ColumnHour {
  label: string;
  property: columnsHours;
  canEdit: boolean;
}
