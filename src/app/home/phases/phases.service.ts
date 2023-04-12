import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import phaseQueries from './phase.gql';
import { IPhase } from './model/phase.model';
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

  async createPhase(createPhaseInput): Promise<IPhase> {
    console.log('a');
    const mutationRef = this.graphql.refMutation(
      phaseQueries.mutation.createPhase,
      { createPhaseInput },
      [],
      { auth: true }
    );
    console.log('b');
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createPhase))
    );
  }
}
