import { UpdateResultPayload } from "@shared/models/graphql/update-result-payload"
import { PageRequest } from "@shared/models/requests/page-request";
import { PaginatedResult } from "@shared/models/requests/paginated-result";
import { DownloadRequest } from "./download-request";
import { DownloadResult } from "./download-result";

export abstract class DocumentProvider {
  getDocuments: (args: any) => Promise<any[]>;
  clearCache?: () => Promise<void>;
  getDocumentsPage?: (args: any, request: PageRequest) => Promise<PaginatedResult<any>>;
  deleteDocuments?: (ids: string[]) => Promise<UpdateResultPayload>;
  requestDownload?: (downloadRequest: DownloadRequest) => Promise<DownloadResult>
}