import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import { IUser, User } from '@auth/models/user';
import { ValidRoles } from './models/valid-roles.enum';
import { StorageService } from '@shared/storage/storage.service';
import { StoragePaths } from '@shared/storage/storage.constants';
import userQueries from './user.gql';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService
  ) {}

  // Queries
  async getUserByUid(uid: string): Promise<User> {
    const queryRef = this.graphql.refQuery(
      userQueries.query.getUserByUid,
      { uid },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(map((request) => request.data.user))
    );
  }

  async getUsers(
    search: string = '',
    roles: ValidRoles[] = [],
    relationsAssign: {
      phases?: string;
      batches?: string;
      startups?: string;
    } = null
  ): Promise<IUser[]> {
    const queryRef = this.graphql.refQuery(
      userQueries.query.users,
      { search, roles, relationsAssign },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(map((request) => request.data.users))
    );
  }

  // Mutations
  async createUser(user: Omit<IUser, '_id'>): Promise<User> {
    const mutationRef = this.graphql.refMutation(
      userQueries.mutation.createUser,
      { createUserInput: user },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createUser))
    );
  }

  async createUserFromInvitation(code: string, name: string, password: string) {
    const mutationRef = this.graphql.refMutation(
      userQueries.mutation.createUserFromInvitation,
      { code, name, password },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.createUserFromInvitation))
    );
  }

  async disableUser(uid: string) {
    const mutRef = this.graphql.refMutation(
      userQueries.mutation.disableUser,
      { uid },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(map((request) => request.data))
    );
  }

  async enableUser(uid: string) {
    const mutRef = this.graphql.refMutation(
      userQueries.mutation.enableUser,
      { uid },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(map((request) => request.data))
    );
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<User> {
    data._id = id;
    const mutRef = this.graphql.refMutation(
      userQueries.mutation.updateUser,
      { updateUserInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(map((request) => request.data.updateUser))
    );
  }

  updateProfileImage(user: User, file: File) {
    const renamedFile = new File([file], user.uid, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(
      StoragePaths.profileImages,
      renamedFile,
      true
    );
  }

  removeProfileImage(user: User) {
    return this.storageService.deleteFile(StoragePaths.profileImages, user.uid);
  }

  async inviteUserStartup(
    body: string,
    from: string,
    subject: string,
    to: string,
    startupId: string,
    startupName: string
  ) {
    const queryRef = this.graphql.refQuery(
      userQueries.query.inviteUser,
      {
        body,
        from,
        subject,
        to,
        startupId,
        startupName,
      },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(this.graphql.query(queryRef));
  }
}
