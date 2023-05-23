import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { ActivitiesConfig, IActivitiesConfig } from '../model/activities.model';
import activitiesConfigQueries from '../graphql/activities-config.gpl';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhaseHourConfigService {
  constructor(private readonly graphql: GraphqlService) {}

  async watchConfig(phase: string) {
    const activitiesConfigPhase = this.graphql.refQuery(
      activitiesConfigQueries.query.getConfig,
      { phase },
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(activitiesConfigPhase).valueChanges.pipe(
      map((request) => request.data.activitiesConfigPhase),
      map((content) => ActivitiesConfig.fromJson(content))
    );
  }

  async createConfig(createActivitiesConfigInput): Promise<ActivitiesConfig> {
    const mutationRef = this.graphql.refMutation(
      activitiesConfigQueries.mutation.createActivitiesConfig,
      { createActivitiesConfigInput },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createActivitiesConfig),
        map((body) => ActivitiesConfig.fromJson(body))
      )
    );
  }

  async updateConfig(
    id: string,
    data: Partial<IActivitiesConfig>
  ): Promise<ActivitiesConfig> {
    data._id = id;
    const updateActivitiesConfig = this.graphql.refMutation(
      activitiesConfigQueries.mutation.updateActivitiesConfig,
      { updateActivitiesConfigInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(updateActivitiesConfig)
        .pipe(map((request) => request.data.updateActivitiesConfig))
    );
  }
}
