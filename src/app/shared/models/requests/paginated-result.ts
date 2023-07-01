export interface PaginatedResult<TDocument> {
  totalRecords: number;
  documents: TDocument[];
}