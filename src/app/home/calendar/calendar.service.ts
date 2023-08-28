import { Injectable } from '@angular/core';
import eventsQueries from '../phases/phase-events/graphql/events.gql';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { map } from 'rxjs';
import { Event } from '@home/phases/phase-events/models/events.model';
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  _getEvents;
  constructor(private graphql: GraphqlService) {}

  async watchEvents() {
    this._getEvents = this.graphql.refQuery(
      eventsQueries.query.getEventsUser,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getEvents).valueChanges.pipe(
      map((request) => request.data.eventsUser),
      map((events) => events.map((eventDoc) => Event.fromJson(eventDoc)))
    );
  }
}
