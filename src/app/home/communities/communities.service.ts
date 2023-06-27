import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Startup } from '@shared/models/entities/startup';
import startupsQueries from '@shared/services/startups/startups.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunitiesService {
  constructor(private readonly graphql: GraphqlService) {}

  async getDocuments(args: {}): Promise<Startup[]> {
    const queryRef = this.graphql.refQuery(
      startupsQueries.query.startupsCommunities,
      {},
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.startupsCommunities))
    );
  }
}
