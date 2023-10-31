import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { firstValueFrom, map } from 'rxjs';
import phaseQueries from './graphql/phase.gql';
import stageQueries from './graphql/stage.gql';
import { IPhase, Phase } from './model/phase.model';
import { IStage, Stage } from './model/stage.model';
import { StorageService } from '@shared/storage/storage.service';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { Permission } from '@auth/models/permissions.enum';
import { IMenu } from '@shared/models/menu';
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
    delete createStageInput['_id'];
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
      [this._getStages],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateStage),
        map((stage) => Stage.fromJson(stage))
      )
    );
  }

  async updateStageIndex(
    newIndex,
    stageId,
    typeChange: 'up' | 'down'
  ): Promise<Stage> {
    const mutRef = this.graphql.refMutation(
      stageQueries.mutation.changeIndex,
      { newIndex, stageId, typeChange },
      [this._getStages],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateStageIndex),
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

  async getPhasesList(
    ids: string[],
    withExtraFields?: boolean
  ): Promise<Phase[]> {
    const queryRef = this.graphql.refQuery(
      withExtraFields
        ? phaseQueries.query.phasesListWithExtra
        : phaseQueries.query.phasesList,
      { ids },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.phasesList),
        map((phases) => phases.map((phase) => Phase.fromJson(phase)))
      )
    );
  }

  async getPhasesBase(): Promise<Phase[]> {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.phasesBases,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.phasesBases),
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
      phase._id,
      true
    );
  }

  optionsMenu(phase: IPhase, user: User) {
    let menu: IMenu = {
      header: {
        title: 'Edición',
      },
      switchTypeMenu: [
        { type: 'edit', label: 'Edición' },
        { type: 'manage', label: 'Gestionar' },
      ],
      returnPath: ['home', 'phases'],
      options: [
        {
          label: 'Información',
          rute: ['/home', 'phases', phase._id, 'edit'].join('/'),
          type: 'single',
          icon: 'file-description',
          menuType: 'edit',
        },
      ],
    };
    if (phase.basePhase || user?.allowed(Permission.phases_batch_edit)) {
      menu.options.push({
        label: 'Contenidos',
        icon: 'layout-board-split',
        rute: ['/home', 'phases', phase._id, 'content'].join('/'),
        type: 'single',
        menuType: 'edit',
      });
    }
    if (!phase.basePhase)
      menu.options.push({
        label: 'StartUps',
        rute: ['/home', 'phases', phase._id, 'startups'].join('/'),
        icon: 'seeding',
        type: 'single',
        menuType: 'edit',
      });
    if (
      !phase.basePhase &&
      [ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.host].includes(
        user?.rolType as ValidRoles
      )
    ) {
      menu.options.push({
        label: 'Expertos',
        rute: ['/home', 'phases', phase._id, 'experts'].join('/'),
        icon: 'file-description',
        type: 'single',
        menuType: 'edit',
      });
    }
    if (!phase.basePhase && user?.allowed(Permission.evaluation_view))
      menu.options.push({
        label: 'Evaluaciones',
        rute: ['/home', 'phases', phase._id, 'evaluations'].join('/'),
        icon: 'file-description',
        type: 'single',
        menuType: 'manage',
      });
    if (!phase.basePhase && user?.allowed(Permission.events_view))
      menu.options.push({
        label: 'Eventos',
        rute: ['/home', 'phases', phase._id, 'events'].join('/'),
        icon: 'file-description',
        type: 'single',
        menuType: 'manage',
      });
    if (user?.allowed(Permission.hours_view))
      menu.options.push({
        label: 'Bolsas de horas',
        rute: ['/home', 'phases', phase._id, 'bag-hours'].join('/'),
        icon: 'clock',
        type: 'single',
        menuType: 'edit',
      });
    if (!phase.basePhase && user?.allowed(Permission.homeworks_view))
      menu.options.push({
        label: 'Tareas',
        rute: ['/home', 'phases', phase._id, 'homeworks'].join('/'),
        icon: 'file-description',
        type: 'single',
        menuType: 'manage',
      });
    return menu;
  }

  async searchInBatch(batchIds: string[], searchValue: string): Promise<any> {
    const queryRef = this.graphql.refQuery(
      phaseQueries.query.searchInBatchOutput,
      { othersInput: { batchIds, searchValue } },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.searchInBatch))
    );
  }
}
