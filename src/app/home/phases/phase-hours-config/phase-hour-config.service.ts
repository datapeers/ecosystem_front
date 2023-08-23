import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import {
  ActivitiesConfig,
  IActivitiesConfig,
  IActivityConfig,
  IAssign,
} from '../model/activities.model';
import activitiesConfigQueries from '../graphql/activities-config.gpl';
import { firstValueFrom, map } from 'rxjs';
import { IConfigStartup } from './models/config-startup';

@Injectable({
  providedIn: 'root',
})
export class PhaseHourConfigService {
  constructor(private readonly graphql: GraphqlService) {}

  async watchConfig(phase: string) {
    const activitiesConfigPhase = this.graphql.refQuery(
      activitiesConfigQueries.query.getConfig,
      { phase },
      'network-only',
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

  getHoursForOthers(limit: number, pending: number) {
    let hoursForOthersStartups = Math.round(limit / pending);
    if (hoursForOthersStartups < 1) return 1;
    if (hoursForOthersStartups * pending > limit) {
      return this.getHoursForOthers(limit - 1, pending);
    }
    return hoursForOthersStartups;
  }

  configOrChange(
    activity: IActivityConfig,
    startupConfig: IConfigStartup,
    config: ActivitiesConfig,
    changes: IAssign[]
  ): IAssign {
    const previousConfig = config.startups.findIndex(
      (i) => i.id === startupConfig._id && i.activityID === activity.id
    );
    const previousChange = changes.findIndex(
      (i) => i.id === startupConfig._id && i.activityID === activity.id
    );
    if (previousChange !== -1) {
      if (changes[previousChange].limit !== startupConfig.hours[activity.id]) {
        changes[previousChange].limit = startupConfig.hours[activity.id];
      }
      return changes[previousChange];
    }
    if (previousConfig !== -1) {
      if (
        config.startups[previousConfig].limit !==
        startupConfig.hours[activity.id]
      ) {
        changes.push({
          id: startupConfig._id,
          limit: startupConfig.hours[activity.id],
          activityID: activity.id,
        });
        return changes[changes.length - 1];
      }
      return config.startups[previousConfig];
    }
    return null;
  }
}
