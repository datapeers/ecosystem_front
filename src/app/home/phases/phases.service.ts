import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import phaseQueries from './phase.gql';
import { IPhase, Phase } from './model/phase.model';
import { StorageService } from '@shared/services/storage.service';
import { StoragePaths } from '@shared/services/storage.constants';
@Injectable({
  providedIn: 'root',
})
export class PhasesService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService,
  ) {}

  async getPhase(id: string): Promise<Phase> {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.getPhase,
      { id },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef)
      .pipe(
        map((request) => request.data.phase),
        map((phase) => Phase.fromJson(phase))
      )
    );
  }

  async getPhases() {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.getPhases,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef)
      .pipe(
        map((request) => request.data.phases),
        map((phases) => phases.map(phase => Phase.fromJson(phase)))
      )
    );
  }

  async createPhase(createPhaseInput, basePhase: boolean): Promise<Phase> {
    createPhaseInput.basePhase = basePhase;
    const mutationRef = this.graphql.refMutation(
      phaseQueries.mutation.createPhase,
      { createPhaseInput },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutationRef)
        .pipe(
          map((request) => request.data.createPhase),
          map((phase) => Phase.fromJson(phase))
        )
    );
  }

  async updatePhase(id: string, data: Partial<IPhase>): Promise<Phase> {
    data._id = id;
    const mutRef = this.graphql.refMutation(
      phaseQueries.mutation.updatePhase,
      { updatePhaseInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(this.graphql
      .mutation(mutRef)
      .pipe(map((request) => request.data.updatePhase))
    );
  }

  updatePhaseThumbnail(phase: Phase, file: File) {
    const renamedFile = new File([file], phase._id, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(StoragePaths.phaseThumbnails, renamedFile);
  }

  removePhaseThumbnail(phase: Phase) {
    return this.storageService.deleteFile(StoragePaths.phaseThumbnails, phase._id);
  }
}
