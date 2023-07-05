import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map, take } from 'rxjs';
import expertsQueries from './experts.gql';
import { Expert } from '@shared/models/entities/expert';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { User } from '@auth/models/user';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';
import { PageRequest } from '@shared/models/requests/page-request';
import { PaginatedResult } from '@shared/models/requests/paginated-result';
import { jsonUtils } from '@shared/utils/json.utils';

@Injectable({
  providedIn: 'root',
})
export class ExpertsService implements DocumentProvider {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly formService: FormService
  ) {}

  cachedQueries: string[] = [];

  async clearCache(): Promise<void> {
    this.graphql.evictStore(this.cachedQueries);
  }

  async getDocuments(args: any): Promise<Expert[]> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.query.experts,
      {},
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(map((request) => request.data.experts))
    );
  }

  async getDocumentsPage(_: any, request: PageRequest): Promise<PaginatedResult<Expert>> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.query.expertsPage,
      { request },
      'cache-first',
      { auth: true }
    );
    request = jsonUtils.sortObjectKeys(request);
    const requestKey = `expertsPage(${JSON.stringify({ request })})`;
    if(!this.cachedQueries.some(queryKey => queryKey === requestKey)) {
      this.cachedQueries.push(requestKey);
    }
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.expertsPage))
    );
  }

  async findById(id: string): Promise<Expert> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.query.expertById,
      { id },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.expert)
        // map((phase) => Expert.fromJson(phase))
      )
    );
  }

  async findUser(accountId: string): Promise<Expert> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.query.expertByAccount,
      { accountId },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.expertsAccount)
        // map((phase) => Expert.fromJson(phase))
      )
    );
  }

  async getUserDoc(user: User) {
    let doc = await this.findUser(user.uid);
    if (!doc) {
      const forms = await this.formService.getFormByCollection(
        FormCollections.experts
      );
      if (!forms.length) {
        return doc;
      }
      const entityForm = forms.find(() => true);
      const subscription = await this.formService.createFormSubscription({
        form: entityForm._id,
        reason: 'Create expert',
        data: {
          accountId: user.uid,
        },
      });
      const ref = this.formService.openFormFromSubscription(
        subscription,
        'Creación de ficha para experto'
      );
      const idNewExpert = await firstValueFrom(ref.pipe(take(1)));
      if (!idNewExpert) return null;
      return await this.findById(idNewExpert);
    } else {
      return doc;
    }
  }

  async deleteDocuments(ids: string[]): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      expertsQueries.mutation.deleteExperts,
      { ids },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutationRef)
      .pipe(
        map((request) => request.data.deleteExperts),
      )
    );
  }
}
