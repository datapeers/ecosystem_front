import { IForm } from "@shared/form/models/form";
import { AnnouncementTypes, announcementTypeNames } from "./announcement-types.enum";

export interface IAnnouncement {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  landing?: string;
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
}

export class Announcement implements IAnnouncement {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  landing?: string;
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

  get typeName() {
    return announcementTypeNames[this.type];
  }

  private constructor() {}

  static fromJson(data: IAnnouncement): Announcement {
    const announcement = new Announcement();
    Object.assign(announcement, {
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: new Date(data.deletedAt),
    });
    return announcement;
  }
}