import { IRol, Rol } from './rol';
import { ValidRoles, validRolName, validRoles } from './valid-roles.enum';

export interface IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  rol: Rol;
  isActive: boolean;
  profileImageUrl: string;
  relationsAssign: IRelationsUser;
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

  get nameInitial(): string {
    return (
      this.fullName && this.fullName !== '' ? this.fullName : 'U'
    )[0].toUpperCase();
  }
  get rolName(): string {
    return this.rol.name;
  }
  get rolType(): string {
    return this.rol.type;
  }

  get isSuperAdmin() {
    return this.rol.type === ValidRoles.superAdmin;
  }
  get isAdmin() {
    return this.rol.type === ValidRoles.admin;
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

  constructor(data: IUser) {
    Object.assign(this, data);
  }
}

interface IRelationsUser {
  phases: { _id: string; name: string }[];
  batches: { _id: string; name: string }[];
  startups: { _id: string; name: string }[];
}
