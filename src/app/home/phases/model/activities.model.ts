import {
  IConfigExpert,
  IConfigStartup,
} from '../phase-hours-config/models/config-startup';

export interface IActivitiesConfig {
  _id: string;
  limit: number;
  activities: IActivityConfig[];
  startups: IAssign[];
  experts: IAssign[];
  teamCoaches: IAssign[];
  calcHours: {
    hoursAssignStartups: IConfigStartup[];
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IActivityConfig {
  id: string;
  limit: number;
}

export interface IActivityConfigInput extends IActivityConfig {
  activityName: string;
  expertFocus: boolean;
  teamCoachFocus: boolean;
}

export interface IAssign {
  limit: number;
  activityID: string;
  entityID: string;
  __typename?: any;
}

export class ActivitiesConfig implements IActivitiesConfig {
  _id: string;
  limit: number;
  totalLimit: number;
  activities: IActivityConfig[];
  startups: IAssign[];
  experts: IAssign[];
  teamCoaches: IAssign[];
  calcHours: {
    hoursAssignStartups: IConfigStartup[];
    hoursAssignExperts: IConfigExpert[];
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  private constructor() {}

  static fromJson(data: IActivitiesConfig): ActivitiesConfig {
    const content = new ActivitiesConfig();
    Object.assign(content, {
      ...data,
      experts: data.experts.map(({ __typename, ...rest }) => rest),
      teamCoaches: data.teamCoaches.map(({ __typename, ...rest }) => rest),
      startups: data.startups.map(({ __typename, ...rest }) => rest),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return content;
  }
}
