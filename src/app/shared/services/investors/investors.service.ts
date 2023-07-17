import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Investor } from '@shared/models/entities/investor';
import { firstValueFrom, map } from 'rxjs';
import investorQueries from './investors.gql';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';
import { PageRequest } from '@shared/models/requests/page-request';
import { PaginatedResult } from '@shared/models/requests/paginated-result';
import { jsonUtils } from '@shared/utils/json.utils';
import { DownloadRequest } from '@shared/components/dynamic-table/models/download-request';
import { DownloadResult } from '@shared/components/dynamic-table/models/download-result';

@Injectable({
  providedIn: 'root'
})
export class InvestorsService {

  constructor(
    private readonly graphql: GraphqlService,
  ) {
    
  }

  cachedQueries: string[] = [];

  async clearCache(): Promise<void> {
    this.graphql.evictStore(this.cachedQueries);
  }

  async getDocuments(args: any): Promise<Investor[]> {
    const queryRef = this.graphql.refQuery(
      investorQueries.query.investors,
      { },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.investors),
      )
    );
  }

  async getDocumentsPage(_: any, request: PageRequest): Promise<PaginatedResult<Investor>> {
    const queryRef = this.graphql.refQuery(
      investorQueries.query.investorsPage,
      { request },
      'cache-first',
      { auth: true }
    );
    request = jsonUtils.sortObjectKeys(request);
    const requestKey = `investorsPage(${JSON.stringify({ request })})`;
    if(!this.cachedQueries.some(queryKey => queryKey === requestKey)) {
      this.cachedQueries.push(requestKey);
    }
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.investorsPage))
    );
  }

  async deleteDocuments(ids: string[]): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      investorQueries.mutation.deleteInvestors,
      { ids },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.deleteInvestors),
      )
    );
  }

  async requestDownload(downloadRequest: DownloadRequest): Promise<DownloadResult> {
    const queryRef = this.graphql.refQuery(
      investorQueries.query.investorsDownload,
      { ...downloadRequest },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.investorsDownload))
    );
  }
}
