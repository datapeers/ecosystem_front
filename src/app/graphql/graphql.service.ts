import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { QueryOptions, MutationOptions } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService implements OnDestroy {
  onDestroy$: Subject<void> = new Subject();
  token: string;
  constructor(
    private readonly apollo: Apollo,
    private readonly afAuth: AngularFireAuth
  ) {
    this.afAuth.idToken
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((idToken) => {
      this.token = idToken;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  refMutation(
    request: string,
    variables: any,
    refetchQueries?: any[],
    config?: { auth?: boolean; rol?: boolean },
  ): MutationOptions {
    const reqDocument = gql(request);
    const token = config?.auth ? this.token : null;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return {
      mutation: reqDocument,
      fetchPolicy: 'network-only',
      variables,
      context: {
        headers,
      },
      refetchQueries,
    };
  }

  refQuery(
    request: string,
    variables: {},
    fetchPolicy:
      | 'cache-first'
      | 'cache-only'
      | 'network-only'
      | 'no-cache'
      | 'standby',
    config?: { auth: boolean; rol?: boolean },
  ): QueryOptions {
    const reqDocument = gql(request);
    const token = config?.auth ? this.token : null;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return {
      query: reqDocument,
      fetchPolicy,
      variables,
      context: {
        headers,
      },
    };
  }

  query(queryRef: QueryOptions) {
    return this.apollo.query<any>(queryRef);
  }

  watch_query(queryRef: QueryOptions) {
    return this.apollo.watchQuery<any>(queryRef);
  }

  mutation(mutationRef: MutationOptions) {
    return this.apollo.mutate<any>(mutationRef);
  }

  subscribeRequest(stringSubscribe: string, variables: any) {
    return this.apollo.subscribe<any>({
      query: gql` ${stringSubscribe} `,
      variables: variables,
      fetchPolicy: 'network-only',
    });
  }

  refetchQuery(query) {
    return this.apollo.client.refetchQueries({ include: [query] });
  }

  clearStore() {
    this.apollo.client.clearStore();
  }

  readStore() {
    return this.apollo.client.cache.extract();
  }

  evictStore(queryFieldKeys: string[]) {
    let booleanResult: boolean = true;
    queryFieldKeys.forEach((queryFieldsKey: string) => {
      const deleted = this.apollo.client.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: queryFieldsKey,
      });
      booleanResult = booleanResult && deleted;
    });
    return booleanResult;
  }
}
