import { Injectable } from '@angular/core';
import { User } from '@auth/models/user';
import { Content } from '@home/phases/model/content.model';
import { Phase } from '@home/phases/model/phase.model';
import {
  faCalendar,
  faClipboard,
  faList,
  faCamera,
  faUsers,
  faPenRuler,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import userLogsQueries from './models/user-logs.gql';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Observable, map, firstValueFrom } from 'rxjs';
import { IUserLog } from './models/user-logs';

@Injectable({
  providedIn: 'root',
})
export class ContentsService {
  _watchLogs;
  constructor(private readonly graphql: GraphqlService) {}

  optionsMenu(sprint: Content, user: User) {
    let menu = {
      returnPath: ['home', 'inicio'],
      options: [],
    };
    for (const child of sprint.childs) {
      menu.options.push({
        label: child.name,
        icon: faList,
        rute: ['contents'],
        type: 'single',
        queryParamsRute: { sprint: sprint._id, content: child._id },
      });
    }
    return menu;
  }

  async watchLogsWithFilter(filters: {}): Promise<Observable<IUserLog[]>> {
    this._watchLogs = this.graphql.refQuery(
      userLogsQueries.query.getLogs,
      { filters },
      'cache-first',
      { auth: true }
    );
    return this.graphql
      .watch_query(this._watchLogs)
      .valueChanges.pipe(map((request) => request.data.userLogs));
  }

  async createLog(metadata: any): Promise<IUserLog> {
    const mutationRef = this.graphql.refMutation(
      userLogsQueries.mutation.createUserLog,
      { createUserLogInput: { metadata } },
      [this._watchLogs],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createStage))
    );
  }
}
