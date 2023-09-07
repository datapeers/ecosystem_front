import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from './models/notification';
import { NotificationTypes } from './models/notification-types.enum';
import { NotificationStates } from './models/notification-states.enum';
import { fadeInOut } from '../helper';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [fadeInOut],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notificationsList: Notification[] = [];
  notificationNew: Notification[] = [];
  notificationRead: Notification[] = [];

  modified: Record<string, boolean> = {};
  public get notificationTypes(): typeof NotificationTypes {
    return NotificationTypes;
  }

  constructor() {}

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  async loadComponent() {
    this.notificationsList = [
      new Notification({
        _id: '1',
        text: 'Jhon Doe, tu tutor ha aprobado tu entregable',
        type: NotificationTypes.notes,
        state: NotificationStates.pending,
        isDeleted: false,
        date: '2023-08-09T10:45:00.000Z' as any,
        createdAt: '2023-08-22 15:02:34.199Z' as any,
        updatedAt: '2023-08-22 15:06:16.295Z' as any,
      }),
      new Notification({
        _id: '2',
        text: 'Te restan dos días para completar a tiempo la entrega de la Fase 3',
        type: NotificationTypes.homework,
        state: NotificationStates.pending,
        isDeleted: false,
        date: '2023-08-09T10:45:00.000Z' as any,
        createdAt: '2023-08-22 15:02:34.199Z' as any,
        updatedAt: '2023-08-22 15:06:16.295Z' as any,
      }),
      new Notification({
        _id: '3',
        text: '¡Felicidades! Has completado la Fase 2. No pierdas el ritmo',
        type: NotificationTypes.approved,
        state: NotificationStates.pending,
        isDeleted: false,
        date: '2023-08-09T10:45:00.000Z' as any,
        createdAt: '2023-08-22 15:02:34.199Z' as any,
        updatedAt: '2023-08-22 15:06:16.295Z' as any,
      }),
      new Notification({
        _id: '4',
        text: 'Tienes el evento programado para hoy: "Fortalecimiento de habilidades y aptitudes"',
        type: NotificationTypes.calendar,
        state: NotificationStates.pending,
        isDeleted: false,
        date: '2023-08-09T10:45:00.000Z' as any,
        createdAt: '2023-08-22 15:02:34.199Z' as any,
        updatedAt: '2023-08-22 15:06:16.295Z' as any,
      }),
    ];
    this.setNotification();
  }

  setNotification() {
    this.notificationNew = this.notificationsList.filter(
      (i) => i.state === NotificationStates.pending
    );
    this.notificationRead = this.notificationsList.filter(
      (i) => i.state === NotificationStates.read
    );
  }

  action(notification: Notification, type: 'noRead' | 'read') {
    switch (type) {
      case 'noRead':
        this.notificationMove(notification);
        break;
      case 'read':
        this.notificationDelete(notification);
        break;
      default:
        break;
    }
  }

  notificationMove(notification: Notification) {
    notification.state = NotificationStates.read;
    // this.triggerAnimation(notification);
    this.setNotification();
  }

  notificationDelete(notification: Notification) {
    this.notificationsList = this.notificationsList.filter(
      (i) => i._id !== notification._id
    );
    // this.triggerAnimation(notification);
    this.setNotification();
  }

  triggerAnimation(notification: Notification) {
    this.modified[notification._id] = true;
    setTimeout(() => {
      delete this.modified[notification._id];
    }, 1000);
  }
}
