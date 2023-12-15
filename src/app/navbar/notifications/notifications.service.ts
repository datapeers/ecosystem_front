import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import notificationQueries from './graphql/notifications.gql';
import { Observable, firstValueFrom, map } from 'rxjs';
import { INotification, Notification } from './models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  _watchNotifications;
  constructor(private readonly graphql: GraphqlService) {}

  async watchNotifications(
    targets: string[]
  ): Promise<Observable<INotification[]>> {
    this._watchNotifications = this.graphql.refQuery(
      notificationQueries.query.notificationsTargets,
      { targets },
      'cache-first',
      { auth: true }
    );
    return this.graphql
      .watch_query(this._watchNotifications)
      .valueChanges.pipe(map((request) => request.data.notificationsTargets));
  }

  async updateNotification(
    updateNotificationInput: any
  ): Promise<Notification> {
    const mutationRef = this.graphql.refMutation(
      notificationQueries.mutation.updateNotification,
      { updateNotificationInput },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(
          map((request) =>
            Notification.fromJson(request.data.updateNotification)
          )
        )
    );
  }

  async deleteNotification(id: string): Promise<INotification> {
    const mutationRef = this.graphql.refMutation(
      notificationQueries.mutation.removeNotification,
      { removeNotificationId: id },
      [this._watchNotifications],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.removeNotification))
    );
  }
}
