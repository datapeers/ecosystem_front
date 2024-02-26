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
import { take, takeUntil } from 'rxjs/operators';
import { User } from '@auth/models/user';
import { ToastService } from '@shared/services/toast.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { EvaluationUserComponent } from '@shared/components/evaluation-user/evaluation-user.component';
import { FormService } from '@shared/form/form.service';
import { PhaseEvaluationsService } from '@home/phases/phase-evaluations/phase-evaluations.service';
import { ExpertsService } from '@shared/services/experts/experts.service';
import { setUrlSection } from '@shared/functions/router.utils';

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
  profileDoc;
  public get notificationTypes(): typeof NotificationTypes {
    return NotificationTypes;
  }

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private service: NotificationsService,
    private router: Router,
    private expertService: ExpertsService,
    public dialogService: DialogService,
    private readonly formService: FormService,
    private readonly evaluationsService: PhaseEvaluationsService
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
    this.notificationNew = this.notificationsList
      .filter((i) => i.state === NotificationStates.pending)
      .sort((a, b) => {
        if (a.date > b.date) return -1; // Si 'a' es más reciente que 'b', 'a' debe ir antes
        if (a.date < b.date) return 1; // Si 'a' es más antiguo que 'b', 'b' debe ir antes
        return 0; // Si son iguales, no se cambia el orden
      });
    this.notificationRead = this.notificationsList
      .filter((i) => i.state === NotificationStates.read)
      .sort((a, b) => {
        if (a.date > b.date) return -1; // Si 'a' es más reciente que 'b', 'a' debe ir antes
        if (a.date < b.date) return 1; // Si 'a' es más antiguo que 'b', 'b' debe ir antes
        return 0; // Si son iguales, no se cambia el orden
      });
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

  async goToNotification(notification: Notification) {
    switch (notification.type) {
      case 'rate':
        this.evaluation(notification);
        break;
      case 'homework':
        if (notification.url === '') {
          this.router.navigate(['/home/toolkit']);
          return;
        }
        this.router.navigate([setUrlSection(notification.url)]);
        break;
      case 'approved':
        if (notification.url === '') {
          this.router.navigate(['/home/route']);
          return;
        }
        this.router.navigate([setUrlSection(notification.url)]);
        break;
      case 'advise':
        if (notification.url === '') return;
        this.router.navigate([setUrlSection(notification.url)]);
        break;
      case 'notes':
        if (notification.url === '') {
          this.router.navigate(['/home/helpdesk']);
          return;
        }
        this.router.navigate([setUrlSection(notification.url)]);
        break;
      case 'calendar':
        if (notification.url === '') {
          this.router.navigate(['/home/calendar']);
          return;
        }
        this.router.navigate([setUrlSection(notification.url)]);
        break;
      default:
        break;
    }
  }

  async evaluation(notification: Notification) {
    // if (notification.state !== NotificationStates.read)
    //   this.action(notification, 'read');
    this.toast.info({ summary: 'Cargando...', detail: '', life: 12000 });
    const config = await this.evaluationsService.getConfigEvaluation(
      notification.url
    );
    if (!config) return;
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    const startup = this.profileDoc.startups[0];
    let experts = await this.expertService.getExpertsByStartup(startup._id);
    experts = experts.filter((expert) =>
      expert.phases.find(
        (i) =>
          i._id === config.phase &&
          i.startUps.find((o) => o._id === startup._id)
      )
    );
    for (const iterator of experts) {
      const prevEvaluation = await this.evaluationsService.evaluationByReviewer(
        config._id,
        iterator._id,
        startup._id
      );
      const subscription = await this.formService.createFormSubscription({
        form: config.form,
        reason: 'Evaluar',
        data: {
          evaluated: iterator._id,
          reviewer: startup._id,
          config: config._id,
          form: config.form,
        },
        doc: prevEvaluation ? prevEvaluation._id : undefined,
      });
      const ref = this.formService.openFormFromSubscription(
        subscription,
        'Evaluar'
      );
      const doc = await firstValueFrom(
        ref.pipe(take(1), takeUntil(this.onDestroy$))
      );
      if (notification.state === 'pending' && (doc || prevEvaluation))
        this.notificationMove(notification);
    }
  }
}
