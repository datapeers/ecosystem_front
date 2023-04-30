import { IUser, User } from "../../authentication/models/user";
import { ValidRoles, rolNames } from "@auth/models/valid-roles.enum";
import { InvitationStates, stateNames } from "./invitation-states.enum";

export interface IInvitation {
  _id: string;
  code: string;
  email: string;
  rol: ValidRoles;
  createdBy: IUser;
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
  createdBy: User;
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

  get rolName(): string {
    return rolNames[this.rol];
  }

  get stateName(): string {
    return stateNames[this.state];
  }

  private constructor() {}

  static fromJSON(data: IInvitation): Invitation {
    const invitation = new Invitation();
    Object.assign(invitation, {
      ...data,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      createdBy: new User(data.createdBy)
    });
    return invitation;
  }
}