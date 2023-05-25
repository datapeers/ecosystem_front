import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Investor } from '@shared/models/entities/investor';
import { firstValueFrom, map } from 'rxjs';
import investorQueries from './investors.gql';

@Injectable({
  providedIn: 'root'
})
export class InvestorsService {

  constructor(
    private readonly graphql: GraphqlService,
  ) {
    
  }

  async getDocuments(args: any): Promise<Investor[]> {
    const queryRef = this.graphql.refQuery(
      investorQueries.query.investors,
      { },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.investors),
      )
    );
  }
}
