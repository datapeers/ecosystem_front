import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import tableQueries from './dynamic-table.gql';
import { DynamicTable } from './models/dynamic-table';
import { ITableConfig, TableConfig } from './models/table-config';
import { UpdateResultPayload } from '@shared/models/graphql/update-result-payload';
import { TableJoin } from './models/table-join';

@Injectable({
  providedIn: 'root',
})
export class DynamicTableService {
  constructor(private readonly graphql: GraphqlService) {}

  cachedQueries = {
    tables: {},
    tableConfigs: {},
  };

  // Queries
  getTable(locator: string): Observable<DynamicTable> {
    const queryRef = this.graphql.refQuery(
      tableQueries.query.getTable,
      { locator },
      'cache-first',
      { auth: true }
    );
    this.cachedQueries.tables[locator] = queryRef;
    return this.graphql.watch_query(queryRef).valueChanges.pipe(
      map((request) => request.data.table),
      map((table) => DynamicTable.fromJson(table)),
      catchError((err) => of(null))
    );
  }

  async refetchTable(locator: string) {
    const cachedQuery = this.cachedQueries.tables[locator];
    return this.graphql.refetchQuery(cachedQuery);
  }

  async getTableConfig(id: string): Promise<TableConfig> {
    const queryRef = this.graphql.refQuery(
      tableQueries.query.getTableConfig,
      { id },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.tableConfig),
        map((config) => TableConfig.fromJson(config))
      )
    );
  }

  getTableConfigs(table: string): Observable<TableConfig[]> {
    const queryRef = this.graphql.refQuery(
      tableQueries.query.getTableConfigs,
      { table },
      'cache-first',
      { auth: true }
    );
    this.cachedQueries.tableConfigs[table] = queryRef;
    return this.graphql.watch_query(queryRef).valueChanges.pipe(
      map((request) => request.data.tableConfigs),
      map((configs) => configs.map((config) => TableConfig.fromJson(config)))
    );
  }

  // Mutations
  async createTable(locator: string, form: string): Promise<DynamicTable> {
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.createTable,
      { createTableInput: { locator, form } },
      [this.cachedQueries.tables[locator]],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createTable),
        map((table) => DynamicTable.fromJson(table))
      )
    );
  }

  async createTableConfig(table: string, name: string): Promise<TableConfig> {
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.createTableConfig,
      { createTableConfigInput: { table, name } },
      [this.cachedQueries.tableConfigs[table]],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createTableConfig),
        map((config) => TableConfig.fromJson(config))
      )
    );
  }

  async updateTableConfig(
    tableId: string,
    id: string,
    data: Partial<ITableConfig>
  ): Promise<TableConfig> {
    data._id = id;
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.updateTableConfig,
      { updateTableConfigInput: data },
      [this.cachedQueries.tableConfigs[tableId]],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.updateTableConfig),
        map((config) => TableConfig.fromJson(config))
      )
    );
  }

  async addTableJoin(
    id: string,
    join: TableJoin,
    locator: string
  ): Promise<DynamicTable> {
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.addTableJoin,
      { addTableJoinInput: { id, join } },
      [this.cachedQueries.tables[locator]],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.addTableJoin),
        map((config) => DynamicTable.fromJson(config))
      )
    );
  }

  async removeTableJoin(
    id: string,
    key: string,
    locator: string
  ): Promise<DynamicTable> {
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.removeTableJoin,
      { removeTableJoinInput: { id, key } },
      [this.cachedQueries.tables[locator]],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.removeTableJoin),
        map((config) => DynamicTable.fromJson(config))
      )
    );
  }

  async deleteTableConfig(
    tableId: string,
    id: string
  ): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.deleteTableConfig,
      { id },
      [this.cachedQueries.tableConfigs[tableId]],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.deleteTableConfig))
    );
  }

  async deleteTable(id: string): Promise<UpdateResultPayload> {
    const mutationRef = this.graphql.refMutation(
      tableQueries.mutation.deleteTable,
      { id },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.deleteTable))
    );
  }
}
