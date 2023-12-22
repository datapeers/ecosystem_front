import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from './models/notification';
import { NotificationTypes } from './models/notification-types.enum';
import { NotificationStates } from './models/notification-states.enum';
import { fadeInOut } from '../helper';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { NotificationsService } from './notifications.service';
import { Subscription, Subject, firstValueFrom, first } from 'rxjs';
import { channelsNotificationEnum } from './models/chanels-notification.enum';
import { takeUntil } from 'rxjs/operators';
import { User } from '@auth/models/user';
import { ToastService } from '@shared/services/toast.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { EvaluationUserComponent } from '@shared/components/evaluation-user/evaluation-user.component';

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
  notifications$: Subscription;
  onDestroy$: Subject<void> = new Subject();
  user: User;
  public get notificationTypes(): typeof NotificationTypes {
    return NotificationTypes;
  }

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private service: NotificationsService,
    private router: Router,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.user = await firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    );
    this.service
      .watchNotifications([
        `${channelsNotificationEnum.userNotification} ${this.user._id};`,
      ])
      .then((notifications$) => {
        this.notifications$ = notifications$
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((notificationList) => {
            this.notificationsList = notificationList.map((i) =>
              Notification.fromJson(i)
            );
            this.setNotification();
          });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar notificaciones',
          detail: err,
          life: 12000,
        });
      });
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
    this.service.updateNotification({
      _id: notification._id,
      state: NotificationStates.read,
    });
  }

  notificationDelete(notification: Notification) {
    this.notificationsList = this.notificationsList.filter(
      (i) => i._id !== notification._id
    );
    this.service.deleteNotification(notification._id);
  }

  triggerAnimation(notification: Notification) {
    this.modified[notification._id] = true;
    setTimeout(() => {
      delete this.modified[notification._id];
    }, 1000);
  }

  goToNotification(notification: Notification) {
    switch (notification.type) {
      case 'rate':
        // if (notification.state !== NotificationStates.read)
        //   this.action(notification, 'read');
        this.dialogService.open(EvaluationUserComponent, {
          header: '',
          width: '95vw',
          modal: true,
          maskStyleClass: 'dialog-app',
          data: { user: this.user },
        });
        break;
      case 'homework':
        break;
      case 'approved':
        break;
      case 'advise':
        break;
      case 'notes':
        break;
      case 'calendar':
        break;
      default:
        break;
    }
    if (notification.url === '') return;
    const rutaRelativa = notification.url.replace(location.origin, '');
    this.router.navigate([rutaRelativa]);
  }
}
