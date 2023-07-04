import { PageRequest } from "@shared/models/requests/page-request";

export type TableSelection = {
  selected: string[];
  pageRequest?: PageRequest;
}