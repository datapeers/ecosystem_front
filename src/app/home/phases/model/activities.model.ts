export interface IActivitiesConfig {
  _id: string;
  limit: number;
  totalLimit: number;
  activities: IActivityConfig[];
  experts: IAssignHoursConfig[];
  teamCoaches: IAssignHoursConfig[];
  startups: { id: string; from: string; limit: number; __typename?: any }[];
  phase: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  calcHoursExperts: {
    expertHours: number;
    hoursLeftToOthersExperts: number;
    list: IAssignItem[];
  };
}

export interface IAssignItem {
  from: string;
  limit: number;
  nameFrom: string;
  to: IStartupAssign[];
  expanded: boolean;
}

export interface IStartupAssign {
  id: string;
  limit: number;
  name: string;
  modified: boolean;
}

export interface IActivityConfig {
  idActivity: string;
  limit: number;
  options: any;
}

export interface IAssignHoursConfig {
  from: string;
  limit: number;
  __typename?: any;
}

export class ActivitiesConfig implements IActivitiesConfig {
  _id: string;
  limit: number;
  totalLimit: number;
  activities: IActivityConfig[];
  experts: IAssignHoursConfig[];
  teamCoaches: IAssignHoursConfig[];
  startups: { id: string; from: string; limit: number }[];
  phase: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  calcHoursExperts: {
    expertHours: number;
    hoursLeftToOthersExperts: number;
    list: IAssignItem[];
  };
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
