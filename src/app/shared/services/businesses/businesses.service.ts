import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import businessQueries from './businesses.gql';
import { Business } from '@shared/models/entities/business';

@Injectable({
  providedIn: 'root'
})
export class BusinessesService {

  constructor(
    private readonly graphql: GraphqlService,
  ) {

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
}
