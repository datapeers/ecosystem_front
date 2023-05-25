import { LazyLoadEvent } from "primeng/api";
import { TableExportFormats } from "./table-export-formats.enum";

export interface TableLazyLoadEvent extends LazyLoadEvent {
  filters: any;
  sortField: string;
  sortOrder: number;
}

export interface TableLazyDownloadEvent {
  lazyEvent: TableLazyLoadEvent;
  format: TableExportFormats;
}