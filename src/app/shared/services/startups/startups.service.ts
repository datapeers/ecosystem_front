import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Startup } from '@shared/models/entities/startup';
import startupQueries from './startups.gql';
import { map, firstValueFrom, tap } from 'rxjs';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';
import { PageRequest } from '@shared/models/requests/page-request';
import { ToastService } from '../toast.service';
import { jsonUtils } from '@shared/utils/json.utils';
import { PaginatedResult } from '@shared/models/requests/paginated-result';
import { DownloadRequest } from '@shared/components/dynamic-table/models/download-request';
import { DownloadResult } from '@shared/components/dynamic-table/models/download-result';

@Injectable({
  providedIn: 'root'
})
export class StartupsService implements DocumentProvider {

  constructor(
    private readonly graphql: GraphqlService,
    private readonly toast: ToastService,
  ) {
    
  }

  cachedQueries: string[] = [];

  async clearCache(): Promise<void> {
    this.graphql.evictStore(this.cachedQueries);
  }

  async getDocuments(args: any): Promise<Startup[]> {
    const queryRef = this.graphql.refQuery(
      startupQueries.query.startups,
      { },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.startups),
      )
    );
  }

  async getDocumentsPage(_: any, request: PageRequest): Promise<PaginatedResult<Startup>> {
    const queryRef = this.graphql.refQuery(
      startupQueries.query.startupsPage,
      { request },
      'cache-first',
      { auth: true }
    );
    request = jsonUtils.sortObjectKeys(request);
    const requestKey = `startupsPage(${JSON.stringify({ request })})`;
    if(!this.cachedQueries.some(queryKey => queryKey === requestKey)) {
      this.cachedQueries.push(requestKey);
    }
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.startupsPage))
    );
  }

  async deleteDocuments(ids: string[]): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      startupQueries.mutation.deleteStartups,
      { ids },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.deleteBusinesses),
      )
    );
  }

  async linkWithEntrepreneursByRequest(request: PageRequest, targetIds: string[]): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      startupQueries.mutation.linkStartupsWithEntrepreneursByRequest,
      { request, targetIds },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.linkStartupsWithEntrepreneursByRequest),
        tap((result: UpdateResultPayload) => {
          if(result.acknowledged) {
            this.toast.success({
              detail: "Se asociaron con éxito los empresarios seleccionadas con las empresas"
            });
          } else {
            this.toast.success({
              detail: "Se asociaron con éxito los empresarios seleccionadas con las empresas"
            });
          }
        })
      )
    );
  }

  async linkWithEntrepreneurs(ids: string[], targetIds: string[]): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      startupQueries.mutation.linkStartupsWithEntrepreneurs,
      { ids, targetIds },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.linkStartupsWithEntrepreneurs),
      )
    );
  }
  
  async requestDownload(downloadRequest: DownloadRequest): Promise<DownloadResult> {
    const queryRef = this.graphql.refQuery(
      startupQueries.query.startupsDownload,
      { ...downloadRequest },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.startupsDownload))
    );
  }
}
