import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import phaseQueries from './phase.gql';
@Injectable({
  providedIn: 'root',
})
export class PhasesService {
  constructor(private graphql: GraphqlService) {}

  async getPhases() {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.getPhases,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(map((request) => request.data.phases))
    );
  }

  async createPhase(phase): Promise<any> {
    const mutationRef = this.graphql.refMutation(
      phaseQueries.mutation.createPhase,
      { phase },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createPhase))
    );
  }
}
