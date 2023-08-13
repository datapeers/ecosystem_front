import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { IResourceReply, ResourceReply } from './model/resource-reply.model';
import resourceRepliesQueries from './model/resource-reply.gql';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhaseHomeworksService {
  _getResourceReplies;
  constructor(private graphql: GraphqlService) {}

  async getDocuments(args: {
    resource: string;
    sprint: string;
  }): Promise<ResourceReply[]> {
    this._getResourceReplies = this.graphql.refQuery(
      resourceRepliesQueries.query.getResourceRepliesByResource,
      args,
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getResourceReplies).pipe(
        map((request) => request.data.resourcesReplyByResource),
        map((dataReplies) =>
          dataReplies.map((data) => ResourceReply.fromJson(data))
        )
      )
    );
  }

  async createResourceReply(createResourcesReplyInput): Promise<ResourceReply> {
    delete createResourcesReplyInput['_id'];
    const mutationRef = this.graphql.refMutation(
      resourceRepliesQueries.mutation.createResourceReply,
      { createResourcesReplyInput },
      [this._getResourceReplies],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createResourcesReply),
        map((data) => ResourceReply.fromJson(data))
      )
    );
  }

  async updateConfigsEvaluation(
    updateResourcesReplyInput: Partial<IResourceReply>
  ): Promise<ResourceReply> {
    const mutRef = this.graphql.refMutation(
      resourceRepliesQueries.mutation.updateResourceReply,
      { updateResourcesReplyInput },
      [this._getResourceReplies],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateResourcesReply),
        map((config) => ResourceReply.fromJson(config))
      )
    );
  }
}
