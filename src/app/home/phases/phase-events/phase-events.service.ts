import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { ITypeEvent, TypeEvent } from '../model/events.model';
import typesEventsQueries from '../graphql/types-events.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhaseEventsService {
  constructor(private graphql: GraphqlService) {}

  async createTypesEvent(createTypesEventInput): Promise<TypeEvent> {
    const mutationRef = this.graphql.refMutation(
      typesEventsQueries.mutation.createTypesEvent,
      { createTypesEventInput },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createStage),
        map((stage) => TypeEvent.fromJson(stage))
      )
    );
  }

  async updateTypeEvent(data: Partial<ITypeEvent>): Promise<TypeEvent> {
    const mutRef = this.graphql.refMutation(
      typesEventsQueries.mutation.updateTypeEvent,
      { updateTypesEventInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateStage),
        map((stage) => TypeEvent.fromJson(stage))
      )
    );
  }
}
