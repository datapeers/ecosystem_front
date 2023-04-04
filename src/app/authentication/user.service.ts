import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import { User } from '@shared/models/auth/user';
import userQueries from './user.gql';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly graphql: GraphqlService,
  ) { }

  // Queries
  async getUserByUid(uid: string): Promise<User> {
    const queryRef = await this.graphql.refQuery(
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

  // Mutations
  async createUser(): Promise<User> {
    const mutationRef = await this.graphql.refMutation(
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

}
