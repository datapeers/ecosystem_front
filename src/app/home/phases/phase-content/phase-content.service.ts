import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import contentQueries from './content.gql';
import { IContent, Content } from '../model/content.model';
import { firstValueFrom, map } from 'rxjs';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class PhaseContentService {
  private _getContent;
  constructor(private readonly graphql: GraphqlService) {}

  async watchContent(phase: string) {
    this._getContent = this.graphql.refQuery(
      contentQueries.query.getContents,
      { phase },
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getContent).valueChanges.pipe(
      map((request) => request.data.allContent),
      map((allContent) =>
        allContent.map((content) => Content.fromJson(content))
      )
    );
  }

  async getContent(id: string): Promise<Content> {
    const queryRef = this.graphql.refQuery(
      contentQueries.query.getContent,
      { id },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.content),
        map((content) => Content.fromJson(content))
      )
    );
  }

  async createContent(createContentInput): Promise<Content> {
    const mutationRef = this.graphql.refMutation(
      contentQueries.mutation.createContent,
      { createContentInput },
      [this._getContent],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createContent),
        map((content) => Content.fromJson(content))
      )
    );
  }

  convertContainerToNode(
    container: IContent,
    level: number = 0,
    father?: IContent
  ): TreeNode<IContent> {
    const levelNode = level + 1;
    const data = { ...container, levelNode, father };
    const children = container.childs
      ? container.childs.map((child) => {
          return this.convertContainerToNode(child, levelNode, container);
        })
      : [];
    return {
      data,
      expanded: true,
      children,
    };
  }

  async updateContent(data: Partial<IContent>): Promise<Content> {
    const mutRef = this.graphql.refMutation(
      contentQueries.mutation.updateContent,
      { updateContentInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateContent),
        map((content) => Content.fromJson(content))
      )
    );
  }
}
