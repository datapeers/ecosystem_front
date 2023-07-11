import { cloneDeep } from 'lodash';

export interface IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: IPermissions;
}

export class Rol implements IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: IPermissions;
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

export interface IPermissions {
  view_startups: boolean;
  view_experts: boolean;
  view_entrepreneurs: boolean;
  view_business: boolean;
  download_tables: boolean;
  reports: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  community: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  formularios: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  help_desk: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  sites_and_services: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  announcements: {
    view: boolean;
    challenges: boolean;
    create: boolean;
    edit: boolean;
  };
  events: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  actas: {
    view: boolean;
    create: boolean;
    close: boolean;
    edit: boolean;
  };
  phases: {
    view: boolean;
    batch_edit: boolean;
    phase_edit: boolean;
  };
  hours: {
    view: boolean;
    edit_main: boolean;
    edit_activities: boolean;
    edit_startups: boolean;
    edit_experts: boolean;
  };
}
