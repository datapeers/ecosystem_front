export interface UpdateAnnouncementInput {
  _id?: string;
  name?: string;
  description?: string;
  thumbnail?: string;
  form?: string;
  startAt?: Date;
  endAt?: Date;
}