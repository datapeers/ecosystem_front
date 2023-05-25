import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Startup } from '@shared/models/entities/startup';
import startupQueries from './startups.gql';
import { map, firstValueFrom } from 'rxjs';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';

@Injectable({
  providedIn: 'root'
})
export class StartupsService implements DocumentProvider {

  constructor(
    private readonly graphql: GraphqlService,
  ) {
    
  }

  async getDocuments(args: any): Promise<Startup[]> {
    const queryRef = this.graphql.refQuery(
      startupQueries.query.startups,
      { },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.startups),
      )
    );
  }
}
