import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import { IUser, User } from '@shared/models/auth/user';
import userQueries from './user.gql';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly graphql: GraphqlService,
  ) { }

  // Queries
  async getUserByUid(uid: string): Promise<User> {
    const queryRef = this.graphql.refQuery(
      userQueries.query.getUserByUid,
      { uid },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.user))
    );
  }

  async getUsers(search: string = "", roles: ValidRoles[] = []): Promise<IUser[]> {
    const queryRef = this.graphql.refQuery(
      userQueries.query.users,
      { search, roles },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(map((request) => request.data.users))
    );
  }

  // Mutations
  async createUser(): Promise<User> {
    const mutationRef = this.graphql.refMutation(
      userQueries.mutation.createUser,
      {},
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createUser))
    );
  }

  async createUserFromInvitation(code: string, name: string, password: string) {
    const mutationRef = this.graphql.refMutation(
      userQueries.mutation.createUserFromInvitation,
      { code, name, password },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createUserFromInvitation))
    );
  }

  async disableUser(uid: string) {
    const mutRef = this.graphql.refMutation(
      userQueries.mutation.disableUser,
      { uid },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutRef)
      .pipe(map((request) => request.data))
    );
  }

  async enableUser(uid: string) {
    const mutRef = this.graphql.refMutation(
      userQueries.mutation.enableUser,
      { uid },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutRef)
      .pipe(map((request) => request.data))
    );
  }
}
