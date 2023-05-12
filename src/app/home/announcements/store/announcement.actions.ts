import { Action } from '@ngrx/store';
import { Announcement } from '../model/announcement';
import { UpdateAnnouncementInput } from '../model/update-announcement.input';

export const SET_ANNOUNCEMENT = '[Announcement] Set announcement';
export const SET_ERROR = '[Announcement] Set error in store';
export const CLEAR_STORE = '[Announcement] Clear store of auth';
export const UPDATE_ANNOUNCEMENT_IMAGE = '[Announcement] Update announcement thumbnail image';
export const UPDATE_ANNOUNCEMENT = '[Announcement] Update announcement';
export const PUBLISH_ANNOUNCEMENT = '[Announcement] Publish announcement';
export const FAIL_UPDATE_ANNOUNCEMENT = '[Announcement] Failed to update announcement';

export class SetAnnouncementAction implements Action {
  readonly type = SET_ANNOUNCEMENT;
  constructor(public announcement: Announcement) {}
}

export class ClearAnnouncementStoreAction implements Action {
  readonly type = CLEAR_STORE;
}

export class UpdateAnnouncementImageAction implements Action {
  readonly type = UPDATE_ANNOUNCEMENT_IMAGE;

  constructor(public imageUrl: string) {}
}

export class UpdateAnnouncementAction implements Action {
  readonly type = UPDATE_ANNOUNCEMENT;

  constructor(public updates: UpdateAnnouncementInput) {}
}

export class PublishAnnouncementAction implements Action {
  readonly type = PUBLISH_ANNOUNCEMENT;

  constructor() {}
}

export class FailUpdateAnnouncementAction implements Action {
  readonly type = FAIL_UPDATE_ANNOUNCEMENT;

  constructor(public message: string) {}
}

export type AnnouncementActions = SetAnnouncementAction | ClearAnnouncementStoreAction | UpdateAnnouncementImageAction | UpdateAnnouncementAction | FailUpdateAnnouncementAction;
