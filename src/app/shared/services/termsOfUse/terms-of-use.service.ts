import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import termsOfUseQueries from './terms-of-use.gql';
import { ITermsOfUse, TermsOfUse } from './terms-of-use.model';
import { firstValueFrom, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TermsOfUseService {
  _getState;
  constructor(private readonly graphql: GraphqlService) {}

  async getTermsOfUse(name: string): Promise<TermsOfUse> {
    this._getState = this.graphql.refQuery(
      termsOfUseQueries.query.termsOfUseByName,
      { name },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getState).pipe(
        map((request) => request.data.termsOfUseByName),
        map((terms) => TermsOfUse.fromJSON(terms))
      )
    );
  }

  async updateTermsOfUse(updateTermsOfUseInput: {
    _id: string;
    content: string;
    extra_options: Record<string, any>;
  }): Promise<ITermsOfUse> {
    const mutationRef = this.graphql.refMutation(
      termsOfUseQueries.mutation.updateTermsOfUse,
      { updateTermsOfUseInput },
      [this._getState],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.updateTermsOfUse))
    );
  }
}
