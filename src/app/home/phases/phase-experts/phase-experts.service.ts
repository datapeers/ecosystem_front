import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { Expert } from '@shared/models/entities/expert';
import expertsQueries from '@shared/services/experts/experts.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhaseExpertsService implements DocumentProvider {
  constructor(private readonly graphql: GraphqlService) {}

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

  linkExpertToBatch() {}
}
