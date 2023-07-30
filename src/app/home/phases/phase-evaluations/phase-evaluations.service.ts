import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import evaluationsConfigQueries from './models/evaluation-config.gql';
import evaluationsQueries from './models/evaluations.gql';
import { firstValueFrom, map } from 'rxjs';
import {
  ConfigEvaluation,
  IConfigEvaluation,
} from './models/evaluation-config';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { Evaluation } from './models/evaluation';

@Injectable({
  providedIn: 'root',
})
export class PhaseEvaluationsService implements DocumentProvider {
  _getEvaluationsConfig;
  _getEvaluations;
  constructor(private graphql: GraphqlService) {}

  // --------------------------------------------- Config Evaluations ----------------------------------------------

  async watchConfigsEvaluations(phase: string) {
    this._getEvaluationsConfig = this.graphql.refQuery(
      evaluationsConfigQueries.query.getEvaluationsByPhase,
      { phase },
      'cache-first',
      { auth: true }
    );
    return this.graphql
      .watch_query(this._getEvaluationsConfig)
      .valueChanges.pipe(
        map((request) => request.data.configEvaluationsByPhase),
        map((ConfigsEvaluations) =>
          ConfigsEvaluations.map((config) => ConfigEvaluation.fromJson(config))
        )
      );
  }

  async getConfigsEvaluations(phase: string) {
    this._getEvaluationsConfig = this.graphql.refQuery(
      evaluationsConfigQueries.query.getEvaluationsByPhase,
      { phase },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getEvaluationsConfig).pipe(
        map((request) => request.data.configEvaluationsByPhase),
        map((ConfigsEvaluations) =>
          ConfigsEvaluations.map((config) => ConfigEvaluation.fromJson(config))
        )
      )
    );
  }

  async createConfigsEvaluation(
    createConfigEvaluationInput
  ): Promise<ConfigEvaluation> {
    delete createConfigEvaluationInput['_id'];
    const mutationRef = this.graphql.refMutation(
      evaluationsConfigQueries.mutation.createConfigEvaluation,
      { createConfigEvaluationInput },
      [this._getEvaluationsConfig],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createConfigEvaluation),
        map((config) => ConfigEvaluation.fromJson(config))
      )
    );
  }

  async updateConfigsEvaluation(
    updateConfigEvaluationInput: Partial<IConfigEvaluation>
  ): Promise<ConfigEvaluation> {
    const mutRef = this.graphql.refMutation(
      evaluationsConfigQueries.mutation.updateEvaluation,
      { updateConfigEvaluationInput },
      [this._getEvaluationsConfig],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateConfigEvaluation),
        map((config) => ConfigEvaluation.fromJson(config))
      )
    );
  }

  async deleteConfigEvaluation(id: string): Promise<ConfigEvaluation> {
    const mutRef = this.graphql.refMutation(
      evaluationsConfigQueries.mutation.deleteEvaluation,
      { id },
      [this._getEvaluationsConfig],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.removeConfigEvaluation),
        map((config) => ConfigEvaluation.fromJson(config))
      )
    );
  }

  async getDocuments(args: { config: string }): Promise<Evaluation[]> {
    const queryRef = this.graphql.refQuery(
      evaluationsQueries.query.getEvaluationsByConfig,
      args,
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .query(queryRef)
        .pipe(map((request) => request.data.evaluationsByConfig))
    );
  }
}
