import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { ITicket, Ticket } from './model/ticket.model';
import ticketQueries from './graphql/ticket.gql';
import { Observable, firstValueFrom, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HelpdeskService {
  _watchTickets;
  constructor(private readonly graphql: GraphqlService) {}

  async watchTickets(filters: {}): Promise<Observable<ITicket[]>> {
    this._watchTickets = this.graphql.refQuery(
      ticketQueries.query.helpDeskFiltered,
      { filters },
      'cache-first',
      { auth: true }
    );
    return this.graphql
      .watch_query(this._watchTickets)
      .valueChanges.pipe(map((request) => request.data.helpDeskFiltered));
  }

  async createTicket(createHelpDeskInput: any): Promise<Ticket> {
    const mutationRef = this.graphql.refMutation(
      ticketQueries.mutation.createHelpDesk,
      { createHelpDeskInput },
      [this._watchTickets],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createHelpDesk))
    );
  }

  async updateTicket(updateHelpDeskInput: any): Promise<Ticket> {
    const mutationRef = this.graphql.refMutation(
      ticketQueries.mutation.updateHelpDesk,
      { updateHelpDeskInput },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.updateHelpDeskInput))
    );
  }
}
