import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import phaseQueries from './graphql/phase.gql';
import stageQueries from './graphql/stage.gql';
import { IPhase, Phase } from './model/phase.model';
import { IStage, Stage } from './model/stage.model';
import { StorageService } from '@shared/storage/storage.service';
import { StoragePaths } from '@shared/storage/storage.constants';
import { IMenu } from '@shared/models/menu';
import {
  faCalendar,
  faClipboard,
  faList,
  faCamera,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { User } from '@auth/models/user';
@Injectable({
  providedIn: 'root',
})
export class PhasesService {
  private _getPhases;
  private _getStages;
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService
  ) {}

  async watchStages() {
    this._getStages = this.graphql.refQuery(
      stageQueries.query.getStages,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getStages).valueChanges.pipe(
      map((request) => request.data.stages),
      map((stages) => stages.map((stage) => Stage.fromJson(stage)))
    );
  }

  async createStage(createStageInput): Promise<Stage> {
    const mutationRef = this.graphql.refMutation(
      stageQueries.mutation.createStage,
      { createStageInput },
      [this._getStages],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createStage),
        map((stage) => Stage.fromJson(stage))
      )
    );
  }

  async updateStage(data: Partial<IStage>): Promise<Stage> {
    const mutRef = this.graphql.refMutation(
      stageQueries.mutation.updateStage,
      { updateStageInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateStage),
        map((stage) => Stage.fromJson(stage))
      )
    );
  }

  async deleteStage(id: string): Promise<Stage> {
    const mutRef = this.graphql.refMutation(
      stageQueries.mutation.deleteStage,
      { id },
      [this._getStages],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.removeStage),
        map((stage) => Stage.fromJson(stage))
      )
    );
  }

  async getPhase(id: string): Promise<Phase> {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.getPhase,
      { id },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.phase),
        map((phase) => Phase.fromJson(phase))
      )
    );
  }

  async getPhases(): Promise<Phase[]> {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.getPhases,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.phases),
        map((phases) => phases.map((phase) => Phase.fromJson(phase)))
      )
    );
  }

  async watchPhases() {
    this._getPhases = this.graphql.refQuery(
      phaseQueries.query.getPhases,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getPhases).valueChanges.pipe(
      map((request) => request.data.phases),
      map((phases) => phases.map((phase) => Phase.fromJson(phase)))
    );
  }

  async createPhase(createPhaseInput): Promise<Phase> {
    const mutationRef = this.graphql.refMutation(
      phaseQueries.mutation.createPhase,
      { createPhaseInput },
      [this._getPhases],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
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
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(map((request) => request.data.updatePhase))
    );
  }

  updatePhaseThumbnail(phase: Phase, file: File) {
    const renamedFile = new File([file], phase._id, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(
      `phases/${phase._id}/thumbnail`,
      renamedFile,
      true
    );
  }

  removePhaseThumbnail(phase: Phase) {
    return this.storageService.deleteFile(
      `phases/${phase._id}/thumbnail`,
      phase._id
    );
  }

  optionsMenu(phase: IPhase, user: User) {
    let menu = {
      returnPath: ['home', 'phases'],
      options: [
        {
          label: 'Información',
          rute: ['phases', phase._id, 'edit'],
          type: 'single',
          icon: faClipboard,
        },
        {
          label: 'Contenidos',
          icon: faList,
          rute: ['phases', phase._id, 'content'],
          type: 'single',
        },
        {
          label: 'StartUps',
          rute: ['phases', phase._id, 'startups'],
          icon: faUsers,
          type: 'single',
        },
        {
          label: 'Expertos',
          rute: ['phases', phase._id, 'experts'],
          icon: faUsers,
          type: 'single',
        },
      ],
    };
    if (user?.rol?.permissions?.events?.view)
      menu.options.push({
        label: 'Eventos',
        rute: ['phases', phase._id, 'events'],
        icon: faCamera,
        type: 'single',
      });
    menu.options.push({
      label: 'Bolsas de horas',
      rute: ['phases', phase._id, 'bag-hours'],
      icon: faCalendar,
      type: 'single',
    });
    return menu;
  }
}
