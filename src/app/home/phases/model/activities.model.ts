export interface IActivitiesConfig {
  _id: string;
  limit: number;
  totalLimit: number;
  availability: any[];
  activities: IActivityConfig[];
  phase: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityConfig {
  idActivity: string;
  limit: number;
  options: any;
}

export class ActivitiesConfig implements IActivitiesConfig {
  _id: string;
  limit: number;
  totalLimit: number;
  availability: any[];
  activities: IActivityConfig[];
  phase: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: IActivitiesConfig): ActivitiesConfig {
    const content = new ActivitiesConfig();
    Object.assign(content, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      availability: data.availability?.map(({ start, end }) => {
        const now = new Date();
        const then = new Date();
        now.setUTCHours(start.hour, start.minute, 0);
        then.setUTCHours(end.hour, end.minute, 0);
        return {
          start: now,
          end: then,
        };
      }),
    });
    return content;
  }
}

export enum ActivitiesTypes {
  mentoring = 'mentoring',
  advisory = 'advisory',
  committees = 'committees',
}

export const activitiesTypesNames: Record<ActivitiesTypes, string> = {
  [ActivitiesTypes.mentoring]: 'Mentoría',
  [ActivitiesTypes.advisory]: 'Asesoría',
  [ActivitiesTypes.committees]: 'Comités',
};

export const activitiesTypesArray: { label: string; value: ActivitiesTypes }[] =
  Object.entries(activitiesTypesNames).map(([value, label]) => ({
    label,
    value: value as ActivitiesTypes,
  }));
