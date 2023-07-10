import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import rolQueries from './graphql/rol.gql';
import { IRol, Rol } from '@auth/models/rol';
import { firstValueFrom, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RolesService {
  _getRoles;
  constructor(private readonly graphql: GraphqlService) {}

  async getRoles(): Promise<Rol[]> {
    const queryRef = this.graphql.refQuery(
      rolQueries.query.getRoles,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.roles),
        map((roles) => roles.map((rolDoc) => Rol.fromJson(rolDoc)))
      )
    );
  }

  async watchRoles() {
    this._getRoles = this.graphql.refQuery(
      rolQueries.query.getRoles,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getRoles).valueChanges.pipe(
      map((request) => request.data.roles),
      map((roles) => roles.map((rolDoc) => Rol.fromJson(rolDoc)))
    );
  }

  async createRol(createRolInput): Promise<Rol> {
    const mutationRef = this.graphql.refMutation(
      rolQueries.mutation.createRol,
      { createRolInput },
      [this._getRoles],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createRol),
        map((rol) => Rol.fromJson(rol))
      )
    );
  }

  async updateRol(id: string, data: Partial<IRol>): Promise<Rol> {
    data._id = id;
    const mutRef = this.graphql.refMutation(
      rolQueries.mutation.updateRol,
      { updateRolInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(map((request) => request.data.updateRol))
    );
  }
}
