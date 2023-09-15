import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { ToastService } from '@shared/services/toast.service';
import { StorageService } from '@shared/storage/storage.service';
import configurationAppQueries from './model/configuration.gql';
import { firstValueFrom, first, map } from 'rxjs';
import { ConfigurationApp } from './model/configurationApp';
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  _getConfig;
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService,
    private readonly toast: ToastService
  ) {}

  async watchConfig() {
    this._getConfig = this.graphql.refQuery(
      configurationAppQueries.query.configurationApp,
      {},
      'network-only',
      { auth: true }
    );
    return this.graphql.watch_query(this._getConfig).valueChanges.pipe(
      map((request) => request.data.configurationApp),
      map((config) => ConfigurationApp.fromJson(config))
    );
  }

  async getConfig() {
    this._getConfig = this.graphql.refQuery(
      configurationAppQueries.query.configurationApp,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getConfig).pipe(
        map((request) => request.data.configurationApp),
        map((config) => ConfigurationApp.fromJson(config))
      )
    );
  }

  async updateConfig(
    id: string,
    data: Partial<ConfigurationApp>
  ): Promise<ConfigurationApp> {
    data._id = id;
    const updateConfig = this.graphql.refMutation(
      configurationAppQueries.mutation.updateConfigurationApp,
      { updateConfigurationAppInput: data },
      [this._getConfig],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(updateConfig)
        .pipe(map((request) => request.data.updateConfigurationApp))
    );
  }
}
