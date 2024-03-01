import { Permission } from './permissions.enum';
import { IRol, Rol } from './rol';
import { ValidRoles } from './valid-roles.enum';

export interface IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  rol: Rol;
  isActive: boolean;
  profileImageUrl: string;
  relationsAssign: IRelationsUser;
  permissions: Permission[];
  passwordSet: any;
}

export class User implements IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  rol: Rol;
  isActive: boolean;
  profileImageUrl: string;
  relationsAssign: IRelationsUser;
  permissions: Permission[];
  passwordSet: boolean;
  get nameInitial(): string {
    return (
      this.fullName && this.fullName !== '' ? this.fullName : 'U'
    )[0].toUpperCase();
  }
  get rolName(): string {
    return this.rol.name;
  }
  get rolType(): ValidRoles {
    return this.rol.type as ValidRoles;
  }

  get isSuperAdmin() {
    return this.rol.type === ValidRoles.superAdmin;
  }
  get isAdmin() {
    return (
      this.rol.type === ValidRoles.admin ||
      this.rol.type === ValidRoles.superAdmin
    );
  }
  get isTeamCoach() {
    return this.rol.type === ValidRoles.teamCoach;
  }
  get isExpert() {
    return this.rol.type === ValidRoles.expert;
  }
  get isUser() {
    return this.rol.type === ValidRoles.user;
  }

  get masterRol() {
    return [ValidRoles.superAdmin, ValidRoles.admin].includes(
      this.rol.type as ValidRoles
    );
  }

  allowed(permission: Permission) {
    return this.permissions?.length !== 0
      ? this.permissions?.includes(permission)
      : this.rol.permissions?.includes(permission);
  }

  constructor(data: IUser) {
    Object.assign(this, data);
    this.passwordSet = data.passwordSet ? true : false;
  }
}

interface IRelationsUser {
  phases: { _id: string; name: string }[];
  batches: { _id: string; name: string }[];
  startups: { _id: string; name: string }[];
  expertFull?: boolean;
  termsAccepted?: boolean;
  hoursDonated?: number;
}
