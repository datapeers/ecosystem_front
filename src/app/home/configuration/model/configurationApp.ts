import { IBenefactor } from './benefactor';
import { IInterestContent } from './interest-content';
import { IVertical } from './vertical';

export interface IConfigurationApp {
  _id?: string;
  dashboard: string;
  verticals: IVertical[];
  services: any[];
  benefactors: IBenefactor[];
  contentOfInterest: IInterestContent[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConfigurationApp implements IConfigurationApp {
  _id?: string;
  dashboard: string;
  verticals: IVertical[];
  services: any[];
  benefactors: IBenefactor[];
  contentOfInterest: IInterestContent[];
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
      benefactors: this.benefactors,
      contentOfInterest: this.contentOfInterest,
    };
  }
}
