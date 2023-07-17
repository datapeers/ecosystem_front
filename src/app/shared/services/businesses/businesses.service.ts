import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map, tap } from 'rxjs';
import businessQueries from './businesses.gql';
import { Business } from '@shared/models/entities/business';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';
import { PageRequest } from '@shared/models/requests/page-request';
import { PaginatedResult } from '@shared/models/requests/paginated-result';
import { jsonUtils } from '@shared/utils/json.utils';
import { ToastService } from '../toast.service';
import { DownloadRequest } from '@shared/components/dynamic-table/models/download-request';
import { DownloadResult } from '@shared/components/dynamic-table/models/download-result';

@Injectable({
  providedIn: 'root'
})
export class BusinessesService {

  constructor(
    private readonly graphql: GraphqlService,
    private readonly toast: ToastService,
  ) {

  }

  cachedQueries: string[] = [];

  async clearCache(): Promise<void> {
    this.graphql.evictStore(this.cachedQueries);
  }

  async getDocuments(args: any): Promise<Business[]> {
    const queryRef = this.graphql.refQuery(
      businessQueries.query.businesses,
      { },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.businesses),
      )
    );
  }

  async getDocumentsPage(_: any, request: PageRequest): Promise<PaginatedResult<Business>> {
    const queryRef = this.graphql.refQuery(
      businessQueries.query.businessesPage,
      { request },
      'cache-first',
      { auth: true }
    );
    request = jsonUtils.sortObjectKeys(request);
    const requestKey = `businessesPage(${JSON.stringify({ request })})`;
    if(!this.cachedQueries.some(queryKey => queryKey === requestKey)) {
      this.cachedQueries.push(requestKey);
    }
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.businessesPage))
    );
  }

  async deleteDocuments(ids: string[]): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      businessQueries.mutation.deleteBusinesses,
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
      businessQueries.mutation.linkBusinessesWithEntrepreneursByRequest,
      { request, targetIds },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.linkBusinessesWithEntrepreneursByRequest),
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
      businessQueries.mutation.linkBusinessesWithEntrepreneurs,
      { ids, targetIds },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.linkBusinessesWithEntrepreneurs),
      )
    );
  }

  async requestDownload(downloadRequest: DownloadRequest): Promise<DownloadResult> {
    const queryRef = this.graphql.refQuery(
      businessQueries.query.businessesDownload,
      { ...downloadRequest },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.businessesDownload))
    );
  }
}
