import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import expertsQueries from './experts.gql';
import { Expert } from '@shared/models/entities/expert';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';

@Injectable({
  providedIn: 'root'
})
export class ExpertsService implements DocumentProvider {

  constructor(
    private readonly graphql: GraphqlService,
  ) {
    
  }

  async getDocuments(args: any): Promise<Expert[]> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.query.experts,
      { },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.experts),
      )
    );
  }
}
