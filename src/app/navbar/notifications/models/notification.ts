import { NotificationStates } from './notification-states.enum';
import { NotificationTypes } from './notification-types.enum';
import * as moment from 'moment';

export interface INotification {
  _id: string;
  text: string;
  url?: string;
  date: Date;
  type: NotificationTypes;
  state: NotificationStates;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export class Notification implements INotification {
  _id: string;
  text: string;
  url?: string;
  date: Date;
  type: NotificationTypes;
  state: NotificationStates;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  dateString: string;
  constructor(data?: Partial<Notification>) {
    const date = data ? new Date(data.date) : new Date();
    Object.assign(this, {
      ...data,
      date,
      createdAt: data ? new Date(data.createdAt) : new Date(),
      updatedAt: data ? new Date(data.updatedAt) : new Date(),

      dateString: moment(date).locale('es').format('dddd DD MMM - h:mm a'),
    });
  }

  static fromJson(data: INotification): Notification {
    const date = data ? new Date(data.date) : new Date();
    const notification = new Notification();
    Object.assign(notification, {
      ...data,
      date,
      createdAt: data ? new Date(data.createdAt) : new Date(),
      updatedAt: data ? new Date(data.updatedAt) : new Date(),
      dateString: moment(date).locale('es').format('dddd DD MMM - h:mm a'),
    });
    return notification;
  }
}
