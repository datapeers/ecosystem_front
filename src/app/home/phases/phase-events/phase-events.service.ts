import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { ITypeEvent, TypeEvent } from '../model/events.model';
import typesEventsQueries from '../graphql/types-events.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhaseEventsService {
  _getTypesEvents;
  constructor(private graphql: GraphqlService) {}

  async watchTypesEvents() {
    this._getTypesEvents = this.graphql.refQuery(
      typesEventsQueries.query.getTypes,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getTypesEvents).valueChanges.pipe(
      map((request) => request.data.typesEvents),
      map((typesEvents) => typesEvents.map((typeEvent) => TypeEvent.fromJson(typeEvent)))
    );
  }

  async createTypesEvent(createTypesEventInput): Promise<TypeEvent> {
    const mutationRef = this.graphql.refMutation(
      typesEventsQueries.mutation.createTypesEvent,
      { createTypesEventInput },
      [this._getTypesEvents],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createTypesEvent),
        map((typeEvent) => TypeEvent.fromJson(typeEvent))
      )
    );
  }

  async updateTypeEvent(data: Partial<ITypeEvent>): Promise<TypeEvent> {
    const mutRef = this.graphql.refMutation(
      typesEventsQueries.mutation.updateTypeEvent,
      { updateTypesEventInput: data },
      [this._getTypesEvents],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateTypesEvent),
        map((typeEvent) => TypeEvent.fromJson(typeEvent))
      )
    );
  }

  async deleteTypeEvent(id: string): Promise<TypeEvent> {
    
    const mutRef = this.graphql.refMutation(
      typesEventsQueries.mutation.deleteTypeEvent,
      { id },
      [this._getTypesEvents],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.removeTypesEvent),
        map((typeEvent) => TypeEvent.fromJson(typeEvent))
      )
    );
  }
}
