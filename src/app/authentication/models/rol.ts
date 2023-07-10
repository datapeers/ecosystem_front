import { cloneDeep } from 'lodash';

export interface IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: any;
}

export class Rol implements IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: any;
  backup_permissions?: any;
  constructor(rol?: IRol) {
    const previousService = cloneDeep(rol);
    this._id = previousService?._id ?? undefined;
    this.name = previousService?.name ?? '';
    this.type = previousService?.type ?? '';
    this.permissions = previousService?.permissions ?? {};
    this.backup_permissions = previousService?.permissions
      ? cloneDeep(previousService?.permissions)
      : {};
  }

  static fromJson(data: IRol): Rol {
    const obj = new Rol();
    Object.assign(obj, {
      ...cloneDeep(data),
      backup_permissions: data?.permissions ? cloneDeep(data?.permissions) : {},
    });
    return obj;
  }
}
