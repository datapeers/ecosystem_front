import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { Startup } from '@shared/models/entities/startup';
import startupsQueries from '@shared/services/startups/startups.gql';
import { firstValueFrom, map } from 'rxjs';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';

@Injectable({
  providedIn: 'root',
})
export class PhaseStartupsService {
  constructor(private readonly graphql: GraphqlService) {}

  async getDocuments(args: { phase: string }): Promise<Startup[]> {
    const queryRef = this.graphql.refQuery(
      startupsQueries.query.startupsPhase,
      args,
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.startupsPhase))
    );
  }

  linkStartupToBatch(
    phaseId: string,
    phaseName: string,
    startups: string[]
  ): Promise<UpdateResultPayload> {
    const queryRef = this.graphql.refQuery(
      startupsQueries.mutation.linkToPhase,
      { name: phaseName, phaseId, startups },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.linkPhaseToStartup))
    );
  }
}
