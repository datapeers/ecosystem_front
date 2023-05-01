import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { getMainDefinition } from '@apollo/client/utilities';
import { environment } from 'src/environments/environment';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

const uri = environment.graphQL; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const http = httpLink.create({ uri });

  const ws = new GraphQLWsLink(
    createClient({
      url: environment.graphqlSubscription,
      retryAttempts: 10,
      shouldRetry: () => true
    })
  );

  const link = split(
    // split based on operation type
    ({ query }) => {
      const ans = getMainDefinition(query);
      return (
        ans.kind === 'OperationDefinition' && ans.operation === 'subscription'
      );
    },
    ws,
    http
  );

  return {
    link: link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            project: {
              merge: true,
            },
          },
        },
      },
    }),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
