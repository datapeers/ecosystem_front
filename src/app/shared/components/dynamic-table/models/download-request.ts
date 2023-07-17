import { PageRequest } from "@shared/models/requests/page-request";
import { TableExportFormats } from "./table-export-formats.enum";

export interface DownloadRequest {
  request: PageRequest;
  configId: string;
  format: TableExportFormats;
}