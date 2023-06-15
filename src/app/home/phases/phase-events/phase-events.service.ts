import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Event, ITypeEvent, TypeEvent } from '../model/events.model';
import typesEventsQueries from '../graphql/types-events.gql';
import eventsQueries from '../graphql/events.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhaseEventsService {
  _getTypesEvents;
  _getEvents;
  constructor(private graphql: GraphqlService) {}

  // --------------------------------------------- Types Events ----------------------------------------------

  async watchTypesEvents() {
    this._getTypesEvents = this.graphql.refQuery(
      typesEventsQueries.query.getTypes,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getTypesEvents).valueChanges.pipe(
      map((request) => request.data.typesEvents),
      map((typesEvents) =>
        typesEvents.map((typeEvent) => TypeEvent.fromJson(typeEvent))
      )
    );
  }

  async getTypesEvents() {
    this._getTypesEvents = this.graphql.refQuery(
      typesEventsQueries.query.getTypes,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getTypesEvents).pipe(
        map((request) => request.data.typesEvents),
        map((typesEvents) =>
          typesEvents.map((typeEvent) => TypeEvent.fromJson(typeEvent))
        )
      )
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

  // ----------------------------------------- Events ---------------------------------------

  async watchEvents() {
    this._getEvents = this.graphql.refQuery(
      eventsQueries.query.getEvents,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getEvents).valueChanges.pipe(
      map((request) => request.data.events),
      map((events) => events.map((eventDoc) => Event.fromJson(eventDoc)))
    );
  }

  async getEvents() {
    this._getEvents = this.graphql.refQuery(
      eventsQueries.query.getEvents,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getEvents).pipe(
        map((request) => request.data.events),
        map((events) => events.map((eventDoc) => Event.fromJson(eventDoc)))
      )
    );
  }

  async createEvent(createEventInput): Promise<Event> {
    const mutationRef = this.graphql.refMutation(
      eventsQueries.mutation.createEvent,
      { createEventInput },
      [this._getEvents],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createEvent),
        map((EventDoc) => Event.fromJson(EventDoc))
      )
    );
  }
}
