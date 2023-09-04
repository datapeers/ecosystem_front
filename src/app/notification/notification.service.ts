import { Injectable, inject } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import notificationQueries from './notification.gql';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _getNotifications;
  private readonly graphQlService = inject(GraphqlService);

  constructor() {}

  listenNotificationSubscription(userId: string) {
    return this.graphQlService
      .subscribeRequest(
        notificationQueries.subscription.listenNotificationSubscription,
        { userId }
      )
      .pipe(map((request) => request.data.notificationSubscription));
  }

  getNotificationList(userId: string) {
    this._getNotifications = this.graphQlService.refQuery(
      notificationQueries.query.notificationList,
      { userId },
      'cache-first',
      { auth: true }
    );
    return this.graphQlService
      .watch_query(this._getNotifications)
      .valueChanges.pipe(map((request) => request.data.notifications));
  }
}
