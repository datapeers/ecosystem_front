import { IRol, Rol } from './rol';
import { ValidRoles, validRolName } from './valid-roles.enum';

export interface IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  rol: Rol;
  isActive: boolean;
  profileImageUrl: string;
}

export class User implements IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  rol: Rol;
  isActive: boolean;
  profileImageUrl: string;

  get nameInitial(): string {
    return (
      this.fullName && this.fullName !== '' ? this.fullName : 'U'
    )[0].toUpperCase();
  }
  get rolName(): string {
    return this.rol.name;
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

  constructor(data: IUser) {
    Object.assign(this, data);
  }
}
