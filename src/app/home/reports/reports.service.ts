import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Report } from './model/report.model';
import reportsQueries from './graphql/report.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private readonly graphql: GraphqlService) {}

  async getReport(id: string): Promise<Report> {
    const query = this.graphql.refQuery(
      reportsQueries.query.report,
      { id },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(query).pipe(map((request) => request.data.report))
    );
  }

  async getAllReports(): Promise<Report[]> {
    const queryRef = this.graphql.refQuery(
      reportsQueries.query.reports,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(map((request) => request.data.reports))
    );
  }
}
