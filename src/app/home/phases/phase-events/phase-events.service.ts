import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { CreateEvent, Event } from './models/events.model';
import { ITypeEvent, TypeEvent } from './models/types-events.model';
import typesEventsQueries from './graphql/types-events.gql';
import eventsQueries from './graphql/events.gql';
import participationEventQueries from './graphql/participation.gql';
import { firstValueFrom, map } from 'rxjs';
import { StorageService } from '@shared/storage/storage.service';
import {
  IParticipationEvent,
  ParticipationEvent,
} from './models/participation.model';

@Injectable({
  providedIn: 'root',
})
export class PhaseEventsService {
  _getTypesEvents;
  _getEvents;
  constructor(
    private graphql: GraphqlService,
    private readonly storageService: StorageService
  ) {}

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

  async watchEvents(batch: string) {
    this._getEvents = this.graphql.refQuery(
      eventsQueries.query.getEventsBatch,
      { batch },
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getEvents).valueChanges.pipe(
      map((request) => request.data.eventsBatch),
      map((events) => events.map((eventDoc) => Event.fromJson(eventDoc)))
    );
  }

  async getEvents(batch: string) {
    this._getEvents = this.graphql.refQuery(
      eventsQueries.query.getEventsBatch,
      { batch },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getEvents).pipe(
        map((request) => request.data.eventsBatch),
        map((events) => events.map((eventDoc) => Event.fromJson(eventDoc)))
      )
    );
  }

  async getEvent(id: string) {
    const query = this.graphql.refQuery(
      eventsQueries.query.getEvent,
      { id },
      'network-only',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(query).pipe(map((request) => request.data.event))
    );
  }

  async createEvent(createEventInput: CreateEvent): Promise<Event> {
    delete createEventInput['_id'];
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

  async updateEvent(updateEventInput: Partial<Event>): Promise<Event> {
    const mutRef = this.graphql.refMutation(
      eventsQueries.mutation.updateEvent,
      { updateEventInput },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(map((request) => request.data.updateEvent))
    );
  }

  async deleteEvent(id: string): Promise<Event> {
    const mutRef = this.graphql.refMutation(
      eventsQueries.mutation.deleteEvent,
      { id },
      [this._getEvents],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.removeEvent),
        map((eventDoc) => Event.fromJson(eventDoc))
      )
    );
  }

  updateEventThumbnail(event: Event, file: File) {
    const renamedFile = new File([file], event._id, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(
      `phases/${event.batch}/events/${event._id}/thumbnail`,
      renamedFile,
      true
    );
  }

  removeEventThumbnail(event: Event) {
    return this.storageService.deleteFile(
      `phases/${event.batch}/events/${event._id}/thumbnail`,
      event._id
    );
  }

  // ----------------------------------------- Participation -----------------------------------

  getParticipation(
    event: string,
    participant: string
  ): Promise<IParticipationEvent> {
    const query = this.graphql.refQuery(
      participationEventQueries.query.participationEvent,
      { event, participant },
      'network-only',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(query)
        .pipe(map((request) => request.data.participationEvent))
    );
  }

  getParticipationByEvent(event: string): Promise<ParticipationEvent[]> {
    const query = this.graphql.refQuery(
      participationEventQueries.query.participationByEvent,
      { event },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(query)
        .pipe(map((request) => request.data.participationByEvent))
    );
  }

  markParticipation(
    event: string,
    participant: string,
    startup: string,
    metadata?: Record<string, any>
  ): Promise<IParticipationEvent> {
    const mutationRef = this.graphql.refMutation(
      participationEventQueries.mutation.createParticipationEvent,
      {
        createParticipationEventInput: {
          event,
          participant,
          startup,
          metadata,
        },
      },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createParticipationEvent))
    );
  }

  updateParticipation(
    id: string,
    metadata?: Record<string, any>
  ): Promise<IParticipationEvent> {
    const mutationRef = this.graphql.refMutation(
      participationEventQueries.mutation.updateParticipantEvent,
      {
        updateParticipationEventInput: {
          _id: id,
          metadata,
        },
      },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.updateParticipantEvent))
    );
  }
}
