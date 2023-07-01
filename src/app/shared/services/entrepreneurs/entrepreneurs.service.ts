import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { Entrepreneur } from '@shared/models/entities/entrepreneur';
import entrepreneurQueries from './entrepreneurs.gql';
import { map, firstValueFrom, take } from 'rxjs';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { User } from '@auth/models/user';
import { PageRequest } from '@shared/models/requests/page-request';
import { PaginatedResult } from '@shared/models/requests/paginated-result';
import { jsonUtils } from '@shared/utils/json.utils';

@Injectable({
  providedIn: 'root',
})
export class EntrepreneursService implements DocumentProvider {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly formService: FormService
  ) {}

  cachedQueries: string[] = [];

  async clearCache(): Promise<void> {
    this.graphql.evictStore(this.cachedQueries);
  }

  async getDocuments(_: any): Promise<Entrepreneur[]> {
    const queryRef = this.graphql.refQuery(
      entrepreneurQueries.query.entrepreneurs,
      {},
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.entrepreneurs))
    );
  }

  async getDocumentsPage(_: any, request: PageRequest): Promise<PaginatedResult<Entrepreneur>> {
    const queryRef = this.graphql.refQuery(
      entrepreneurQueries.query.entrepreneursPage,
      { request },
      'cache-first',
      { auth: true }
    );
    request = jsonUtils.sortObjectKeys(request);
    const requestKey = `entrepreneursPage(${JSON.stringify({ request })})`;
    if(!this.cachedQueries.some(queryKey => queryKey === requestKey)) {
      this.cachedQueries.push(requestKey);
    }
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.entrepreneursPage))
    );
  }

  async findById(id: string): Promise<Entrepreneur> {
    const queryRef = this.graphql.refQuery(
      entrepreneurQueries.query.entrepreneurById,
      { id },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.entrepreneur)
        // map((phase) => Expert.fromJson(phase))
      )
    );
  }

  async findByUser(accountId: string): Promise<Entrepreneur> {
    const queryRef = this.graphql.refQuery(
      entrepreneurQueries.query.entrepreneurByAccount,
      { accountId },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.entrepreneurAccount)
        // map((phase) => Expert.fromJson(phase))
      )
    );
  }

  async getUserDoc(user: User) {
    let doc = await this.findByUser(user.uid);
    if (!doc) {
      const forms = await this.formService.getFormByCollection(
        FormCollections.entrepreneurs
      );
      if (!forms.length) {
        return doc;
      }
      const entityForm = forms.find(() => true);
      const subscription = await this.formService.createFormSubscription({
        form: entityForm._id,
        reason: 'Create entrepreneur',
        data: {
          accountId: user.uid,
        },
      });
      const ref = this.formService.openFormFromSubscription(
        subscription,
        'Creación de ficha para empresario'
      );
      const idNewDoc = await firstValueFrom(ref.pipe(take(1)));
      if (!idNewDoc) return null;
      return await this.findById(idNewDoc);
    } else {
      return doc;
    }
  }
  async deleteDocuments(ids: string[]) {
    const mutationRef = this.graphql.refMutation(
      entrepreneurQueries.mutation.deleteEntrepreneurs,
      { ids },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.deleteEntrepreneurs),
      )
    );
  }
}
