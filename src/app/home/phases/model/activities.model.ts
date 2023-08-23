export interface IActivitiesConfig {
  _id: string;
  limit: number;
  activities: IActivityConfig[];
  startups: IAssign[];
  experts: IAssign[];
  teamCoaches: IAssign[];
  calcHours: {
    hoursAssignStartups: IItemConfig[];
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
}

export interface IAssign {
  id: string;
  limit: number;
  activityID: string;
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
    hoursAssignStartups: IItemConfig[];
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

// export interface IAssignItem {
//   from: string;
//   limit: number;
//   nameFrom: string;
//   to: IStartupAssign[];
//   expanded: boolean;
// }

// export interface IStartupAssign {
//   id: string;
//   limit: number;
//   name: string;
//   modified: boolean;
// }

export interface IItemConfig {
  _id: string;
  hours: any;
  item: any;
}
