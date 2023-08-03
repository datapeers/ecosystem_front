export interface ICalendarItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  url?: string;
  classNames?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: any;
}
