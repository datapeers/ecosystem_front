import { Announcement } from '../model/announcement';
import * as fromAnnouncement from './announcement.actions';
export interface IAnnouncementState {
  announcement: Announcement;
}

const initialState: IAnnouncementState = {
  announcement: null,
};

export function announcementReducer(
  state = initialState,
  action: fromAnnouncement.AnnouncementActions
): IAnnouncementState {
  switch (action.type) {
    case fromAnnouncement.SET_ANNOUNCEMENT:
      return {
        ...state,
        announcement: action.announcement,
      };
    case fromAnnouncement.CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
