import { ValidRoles, validRolName } from './valid-roles.enum';

export interface IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  roles: ValidRoles[];
  isActive: boolean;
  profileImageUrl: string;
}

export class User implements IUser {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  roles: ValidRoles[];
  isActive: boolean;
  profileImageUrl: string;

  get nameInitial(): string {
    return (
      this.fullName && this.fullName !== '' ? this.fullName : 'U'
    )[0].toUpperCase();
  }
  get rolName(): string {
    return validRolName(this.roles[0]);
  }
  get rol(): ValidRoles {
    return this.roles[0];
  }
  get isSuperAdmin() {
    return this.roles.some((rol) => rol === ValidRoles.superAdmin);
  }
  get isAdmin() {
    return this.roles.some((rol) => rol === ValidRoles.admin);
  }
  get isExpert() {
    return this.roles.some((rol) => rol === ValidRoles.expert);
  }
  get isUser() {
    return this.roles.some((rol) => rol === ValidRoles.user);
  }

  constructor(data: IUser) {
    Object.assign(this, data);
  }
}
