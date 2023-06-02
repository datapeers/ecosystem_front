import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { Entrepreneur } from '@shared/models/entities/entrepreneur';
import entrepreneurQueries from './entrepreneurs.gql';
import { map, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrepreneursService implements DocumentProvider {

  constructor(
    private readonly graphql: GraphqlService,
  ) {

  }

  async getDocuments(args: any): Promise<Entrepreneur[]> {
    const queryRef = this.graphql.refQuery(
      entrepreneurQueries.query.entrepreneurs,
      { },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.entrepreneurs),
      )
    );
  }
}
