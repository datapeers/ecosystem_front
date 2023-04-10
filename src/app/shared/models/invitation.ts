import { ValidRoles } from "./auth/valid-roles.enum";
import { InvitationStates } from "./invitation-states.enum";

export interface IInvitation {
  _id: string;
  code: string;
  email: string;
  rol: ValidRoles;
  createdBy: string;
  state: InvitationStates;
  expiresAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export class Invitation implements IInvitation {
  _id: string;
  code: string;
  email: string;
  rol: ValidRoles;
  createdBy: string;
  state: InvitationStates;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  get expired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  };

  get isEnabled(): boolean {
    return !this.expired && this.state === InvitationStates.enabled;
  };

  private constructor() {}

  static fromJSON(data: IInvitation): Invitation {
    const invitation = new Invitation();
    Object.assign(invitation, {
      ...data,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return invitation;
  }
}