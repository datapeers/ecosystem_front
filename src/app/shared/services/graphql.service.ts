import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryOptions, MutationOptions } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  token;

  constructor(private apollo: Apollo, private afAuth: AngularFireAuth) {}

  async tokenFirebase() {
    const user = (await this.afAuth.currentUser) as any;
    this.token = await user.getIdToken(true);
    return;
  }

  async getToken() {
    try {
      if (!this.token) {
        await this.tokenFirebase();
        setInterval(async () => {
          await this.tokenFirebase();
        }, 3500000);
      }
      return this.token;
    } catch (error) {
      console.log('error al obtener token de login');
      console.warn(error);
      return null;
    }
  }

  async refMutation(
    request: string,
    variables: any,
    refetchQueries?: any[],
    config?: { auth?: boolean; rol?: boolean }
  ): Promise<MutationOptions> {
    const reqDocument = gql(request);
    const token = config?.auth ? await this.getToken() : null;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // .set('RolUser', this.rolUser && config.rol ? this.rolUser._id : null);
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

  async refQuery(
    request: string,
    variables: {},
    fetchPolicy:
      | 'cache-first'
      | 'cache-only'
      | 'network-only'
      | 'no-cache'
      | 'standby',
    config?: { auth: boolean; rol?: boolean }
  ): Promise<QueryOptions> {
    const reqDocument = gql(request);
    const token = config?.auth ? await this.getToken() : null;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
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

  subscribeRequest(stringSubscribe: string) {
    return this.apollo.subscribe<any>({
      query: gql`
        ${stringSubscribe}
      `,
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
