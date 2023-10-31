interface ISearchResult {
  label: string;
  type: 'batch' | 'content' | 'resourceContent' | 'resourceSprint';
  metadata: Record<string, any>;
}

export class searchResult {
  label: string;
  type: 'batch' | 'content' | 'resourceContent' | 'resourceSprint';
  metadata: Record<string, any>;

  constructor(item: ISearchResult) {
    return Object.assign(this, item);
  }
}
