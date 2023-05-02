import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import authCodeQueries from './auth-code.gql';
import { AuthCode } from './models/auth-code';

@Injectable({
  providedIn: 'root'
})
export class AuthCodeService {

  constructor(
    private readonly graphql: GraphqlService,
  ) { }

  createAuthCode(): Promise<AuthCode> {
    const mutationRef = this.graphql.refMutation(
      authCodeQueries.mutation.createAuthCode,
      {},
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createAuthCode))
    );
  }
}
