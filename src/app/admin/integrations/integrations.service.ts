import { Injectable } from '@angular/core';
import integrationQueries from './integration.gql';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { IIntegration, Integration } from './model/integration.model';
import { Observable, firstValueFrom, map } from 'rxjs';
import { TypeIntegration } from './model/type-integrations.enum';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  _getIntegrations;
  constructor(private graphql: GraphqlService) {}

  async watchIntegrations(): Promise<Observable<Integration[]>> {
    this._getIntegrations = this.graphql.refQuery(
      integrationQueries.query.integrations,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getIntegrations).valueChanges.pipe(
      map((request) => request.data.integrations),
      map((integrations) =>
        integrations.map((integration) => Integration.fromJson(integration))
      )
    );
  }

  async getIntegrations(): Promise<Integration[]> {
    const queryRef = this.graphql.refQuery(
      integrationQueries.query.integrations,
      {},
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.integrations),
        map((integrations) =>
          integrations.map((integration) => Integration.fromJson(integration))
        )
      )
    );
  }

  async createIntegration(createIntegrationInput: {
    code: string;
    typeIntegration: TypeIntegration;
    metadata: Record<string, any>;
  }): Promise<Integration> {
    const mutRef = this.graphql.refMutation(
      integrationQueries.mutation.createIntegration,
      { createIntegrationInput },
      [this._getIntegrations],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.createIntegration),
        map((integration) => Integration.fromJson(integration))
      )
    );
  }
}
