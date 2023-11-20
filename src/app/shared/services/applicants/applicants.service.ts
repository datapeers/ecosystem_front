import { Injectable } from '@angular/core';
import applicantQueries from './applicants.gql';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Applicant } from '@shared/models/entities/applicant';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { ApplicantState } from '@home/announcements/model/applicant-state';
import { ApplicationStates } from '@home/announcements/model/application-states.enum';
import { resolveStorage } from '@shared/storage/storage.constants';
import { StorageService } from '@shared/storage/storage.service';
import { AnnouncementTargets } from '@home/announcements/model/announcement-targets.enum';

@Injectable({
  providedIn: 'root',
})
export class ApplicantsService implements DocumentProvider {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService
  ) {}

  async getApplicant(id: string, state: ApplicationStates): Promise<Applicant> {
    const queryRef = this.graphql.refQuery(
      applicantQueries.query.applicant,
      { id, state },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.applicant),
        catchError((error) => {
          if (
            error.graphQLErrors.some(
              (error) => error.extensions.originalError.statusCode === 404
            )
          )
            return of(null);
          throw error;
        })
      )
    );
  }

  async getDocuments(args: {
    announcement: string;
    state: ApplicationStates;
  }): Promise<Applicant[]> {
    const queryRef = this.graphql.refQuery(
      applicantQueries.query.applicants,
      { announcement: args.announcement, state: args.state },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.applicants))
    );
  }

  async updateApplicantState(
    id: string,
    updatedState: ApplicantState
  ): Promise<Applicant> {
    const mutationRef = this.graphql.refMutation(
      applicantQueries.mutation.updateApplicantState,
      { updateApplicantStateInput: { id, ...updatedState } },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.updateApplicantState))
    );
  }

  async selectApplicant(
    idApplicant: string,
    idBatch: string,
    nameBatch: string,
    typeApplicant: AnnouncementTargets
  ): Promise<Applicant> {
    const mutationRef = this.graphql.refMutation(
      applicantQueries.mutation.selectApplicantState,
      {
        idApplicant,
        idBatch,
        nameBatch,
        typeApplicant,
      },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(map((request) => request.data.selectApplicantState))
    );
  }

  pushStateAttachment(
    announcementId: string,
    applicantId: string,
    file: File,
    fileName: string
  ) {
    const renamedFile = new File([file], fileName, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(
      resolveStorage.applicantFiles(announcementId, applicantId),
      renamedFile,
      true
    );
  }

  removeStateAttachment(
    announcementId: string,
    applicantId: string,
    fileName: string
  ) {
    return this.storageService.deleteFile(
      resolveStorage.applicantFiles(announcementId, applicantId),
      fileName
    );
  }
}
