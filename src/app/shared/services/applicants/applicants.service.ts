import { Injectable } from '@angular/core';
import applicantQueries from './applicants.gql';
import { firstValueFrom, map } from 'rxjs';
import { Applicant } from '@shared/models/entities/applicant';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';

@Injectable({
  providedIn: 'root'
})
export class ApplicantsService implements DocumentProvider {

  constructor(
    private readonly graphql: GraphqlService,
  ) {

  }

  async getDocuments(args: { announcement: string }): Promise<Applicant[]> {
    const queryRef = this.graphql.refQuery(
      applicantQueries.query.applicants,
      { announcement: args.announcement },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.applicants),
      )
    );
  }
}