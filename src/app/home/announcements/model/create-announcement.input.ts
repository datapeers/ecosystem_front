import { AnnouncementTypes } from "./announcement-types.enum";

export interface CreateAnnouncementInput {
  name: string;
  description: string;
  form: string;
  type: AnnouncementTypes;
  startAt: Date;
  endAt: Date;
}