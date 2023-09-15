export interface IConfigurationApp {
  _id?: string;
  dashboard: string;
  verticals: any[];
  services: any[];
  benefactors: any[];
  contentOfInterest: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConfigurationApp implements IConfigurationApp {
  _id?: string;
  dashboard: string;
  verticals: any[];
  services: any[];
  benefactors: any[];
  contentOfInterest: any[];
  createdAt: Date;
  updatedAt: Date;

  constructor() {}

  static fromJson(data: IConfigurationApp): ConfigurationApp {
    const obj = new ConfigurationApp();
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return obj;
  }

  save(): Partial<ConfigurationApp> {
    return {
      _id: this._id,
      dashboard: this.dashboard,
      verticals: this.verticals,
    };
  }
}
