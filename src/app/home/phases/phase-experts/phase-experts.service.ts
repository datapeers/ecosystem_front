import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { Expert } from '@shared/models/entities/expert';
import expertsQueries from '@shared/services/experts/experts.gql';
import { firstValueFrom, map } from 'rxjs';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';
@Injectable({
  providedIn: 'root',
})
export class PhaseExpertsService implements DocumentProvider {
  constructor(private readonly graphql: GraphqlService) {}

  async getDocuments(args: { phase: string }): Promise<Expert[]> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.query.expertsPhase,
      args,
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.expertsPhase))
    );
  }

  linkExpertToBatch(
    phaseId: string,
    phaseName: string,
    experts: string[]
  ): Promise<UpdateResultPayload> {
    const queryRef = this.graphql.refQuery(
      expertsQueries.mutation.linkToPhase,
      { name: phaseName, phaseId, experts },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.linkPhaseToExperts))
    );
  }
}
