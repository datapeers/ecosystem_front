import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';

@Injectable({
  providedIn: 'root',
})
export class HelpdeskService {
  _watchLogs;
  constructor(private readonly graphql: GraphqlService) {}
}
