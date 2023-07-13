import { Injectable } from '@angular/core';
import { IUser, User } from '@auth/models/user';
import { ValidRoles, rolNames } from '@auth/models/valid-roles.enum';
import { UserService } from '@auth/user.service';
import { InvitationService } from '@shared/services/invitation.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private userService: UserService,
    private invitationService: InvitationService
  ) {}

  async getUsers(
    search: string = '',
    roles: ValidRoles[] = []
  ): Promise<IUser[]> {
    return this.userService.getUsers(search, roles);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    return this.userService.updateUser(id, data);
  }

  async getRoles() {
    return Object.values(rolNames);
  }

  async getInvitations() {
    return await this.invitationService.getInvitations();
  }

  async createInvitation(email: string, rol: ValidRoles) {
    return await this.invitationService.createInvitation(email, rol);
  }

  async cancelInvitation(id: string) {
    return await this.invitationService.cancelInvitation(id);
  }

  async disableUser(uid: string) {
    return await this.userService.disableUser(uid);
  }

  async enableUser(uid: string) {
    return await this.userService.enableUser(uid);
  }
}
