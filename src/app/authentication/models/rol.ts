import { cloneDeep } from 'lodash';
import { Permission, list_of_permissions } from './permissions.enum';
import { ValidRoles } from './valid-roles.enum';

export interface IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: Permission[];
}

export class Rol implements IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: Permission[];
  showPermission: any;
  constructor(rol?: IRol) {
    const previousService = cloneDeep(rol);
    this._id = previousService?._id ?? undefined;
    this.name = previousService?.name ?? '';
    this.type = previousService?.type ?? '';
    this.permissions = previousService?.permissions ?? [];
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

export function permissionsUI(permissions: Permission[] = []) {
  const list = cloneDeep(list_of_permissions);
  let activated = [];
  for (const iterator of list) {
    iterator.activated = permissions.includes(iterator.key);
    if (iterator.activated) {
      activated.push(iterator);
    }
  }
  return [list, activated];
}
