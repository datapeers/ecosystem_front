import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';
import { IInvitation, Invitation } from '@shared/models/invitation';
import invitationQueries from './invitation.gql';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly apiUrl: string = `${environment.api}/invitations`;
  constructor(
    private graphql: GraphqlService,
    private http: HttpClient,
  ) { }

  async acceptInvitation(code: string, name: string, password: string): Promise<Invitation> {
    const body = { code, name, password };
    const request = this.http.post<IInvitation>(this.apiUrl.concat("/accept"), body);
    const data = await firstValueFrom(request);
    return Invitation.fromJSON(data);
  }

  async getInvitations(): Promise<Invitation[]> {
    const queryRef = this.graphql.refQuery(
      invitationQueries.query.invitations,
      { },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .query(queryRef)
      .pipe(
        map((request) => request.data.invitations),
        map((invitations) => invitations.map(invitation => Invitation.fromJSON(invitation)))
      )
    );
  }

  async createInvitation(email: string, rol: ValidRoles): Promise<Invitation> {
    const mutRef = this.graphql.refMutation(
      invitationQueries.mutation.createInvitation,
      { email, rol },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutRef)
      .pipe(
        map((request) => request.data),
        map((invitation) => Invitation.fromJSON(invitation))
      )
    );
  }

  async cancelInvitation(id: string): Promise<Invitation> {
    const mutRef = this.graphql.refMutation(
      invitationQueries.mutation.cancelInvitation,
      { id },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutRef)
      .pipe(
        map((request) => request.data),
        map((invitation) => Invitation.fromJSON(invitation))
      )
    );
  }
}
