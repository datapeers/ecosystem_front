import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import actasQueries from '../../graphql/acta.gql';
import { firstValueFrom, map } from 'rxjs';
import { Acta, IActa } from '@home/phases/model/acta.model';

@Injectable({
  providedIn: 'root',
})
export class ActaService {
  _getActa;
  constructor(private graphql: GraphqlService) {}

  async getActa(event: string) {
    this._getActa = this.graphql.refQuery(
      actasQueries.query.getActaEvent,
      { event },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(this._getActa)
        .pipe(map((request) => request.data.actaEvent))
    );
  }

  async createActa(createActaInput): Promise<Acta> {
    const mutationRef = this.graphql.refMutation(
      actasQueries.mutation.createActa,
      { createActaInput },
      [this._getActa],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createActa),
        map((actaDoc) => Acta.fromJson(actaDoc))
      )
    );
  }

  async updateActa(updateActaInput: Partial<IActa>): Promise<Acta> {
    const mutRef = this.graphql.refMutation(
      actasQueries.mutation.updateActa,
      { updateActaInput },
      [this._getActa],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateActa),
        map((actaDoc) => Acta.fromJson(actaDoc))
      )
    );
  }

  async deleteActa(id: string): Promise<Acta> {
    const mutRef = this.graphql.refMutation(
      actasQueries.mutation.deleteActa,
      { id },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.removeActa),
        map((actaDoc) => Acta.fromJson(actaDoc))
      )
    );
  }

  getActasByEvents(events: string[]) {
    this._getActa = this.graphql.refQuery(
      actasQueries.query.getActaEventsList,
      { events },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(this._getActa)
        .pipe(map((request) => request.data.actaEventsList))
    );
  }
}
