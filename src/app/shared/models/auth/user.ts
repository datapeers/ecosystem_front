import { Entrepreneur } from "../entities/entrepreneur";
import { Startup } from "../entities/startup";
import { ValidRoles } from "./valid-roles.enum";

export interface IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  roles: ValidRoles[];
  isActive: boolean;
}

export class User implements IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  roles: ValidRoles[];
  isActive: boolean;
  
  get rol(): ValidRoles { return this.roles[0]; };
  get isSuperAdmin() { return this.roles.some(rol => rol === ValidRoles.superAdmin); }
  get isAdmin() { return this.roles.some(rol => rol === ValidRoles.admin); }
  get isResponsible() { return this.roles.some(rol => rol === ValidRoles.responsible); }
  get isUser() { return this.roles.some(rol => rol === ValidRoles.user); }

  constructor(data: IUser) {
    Object.assign(this, data);
  }
}

