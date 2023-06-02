import { IForm } from "@shared/form/models/form";
import { AnnouncementTypes, announcementTypeNames } from "./announcement-types.enum";

export interface IAnnouncement {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  landing?: string;
  redirectLink: string;
  exitText: string;
  form: IForm;
  startAt: Date;
  endAt: Date;
  published: boolean;
  type: AnnouncementTypes;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  active: boolean;
  ended: boolean;
  notStarted: boolean;
}

export class Announcement implements IAnnouncement {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  landing?: string;
  redirectLink: string;
  exitText: string;
  form: IForm;
  startAt: Date;
  endAt: Date;
  published: boolean;
  type: AnnouncementTypes;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  active: boolean;
  ended: boolean;
  notStarted: boolean;

  get typeName() {
    return announcementTypeNames[this.type];
  }

  private constructor() {}

  static fromJson(data: IAnnouncement): Announcement {
    const announcement = new Announcement();
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);
    const now = Date.now();
    const ended = now > endAt.getTime();
    const notStarted = now < startAt.getTime();
    Object.assign(announcement, {
      ...data,
      startAt,
      endAt,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: new Date(data.deletedAt),
      active: !ended && !notStarted,
      notStarted,
      ended,
    });
    return announcement;
  }
}