import { TableFilters } from '@shared/components/dynamic-table/models/table-filters';

export type TicketContext = {
  locator: string;
  form: string;
  name: string;
  data?: any;
  defaultFilters?: TableFilters;
};
