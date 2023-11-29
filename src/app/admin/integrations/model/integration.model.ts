import { TypeIntegration } from './type-integrations.enum';

export interface IIntegration {
  _id?: string;
  code: string;
  type: TypeIntegration;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Integration implements IIntegration {
  _id?: string;
  code: string;
  type: TypeIntegration;
  createdAt?: Date;
  updatedAt?: Date;
  constructor() {}

  static fromJson(data: IIntegration): Integration {
    const obInstance = new Integration();
    Object.assign(obInstance, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return obInstance;
  }
}
