import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import contentQueries from '../graphql/content.gql';
import resourceQueries from '../graphql/resource.gql';
import { IContent, Content } from '../model/content.model';
import { Observable, firstValueFrom, map } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { IResource, Resource } from '../model/resource.model';
import { cloneDeep } from '@apollo/client/utilities';

@Injectable({
  providedIn: 'root',
})
export class PhaseContentService {
  private _getContent;
  private _lastContent;
  constructor(private readonly graphql: GraphqlService) {}

  async watchContents(phase: string): Promise<Observable<Content[]>> {
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

  async getContents(phase: string): Promise<Content[]> {
    this._getContent = this.graphql.refQuery(
      contentQueries.query.getContents,
      { phase },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getContent).pipe(
        map((request) => request.data.allContent),
        map((allContent) => allContent.map((doc) => Content.fromJson(doc)))
      )
    );
  }

  async watchContent(id: string) {
    this._lastContent = this.graphql.refQuery(
      contentQueries.query.getContent,
      { id },
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._lastContent).valueChanges.pipe(
      map((request) => request.data.content),
      map((content) => Content.fromJson(content))
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
      ? container.childs
          .filter((i) => !i.isDeleted)
          .map((child) => {
            return this.convertContainerToNode(child, levelNode, container);
          })
      : [];
    return {
      data,
      expanded: true,
      children,
    };
  }

  convertResourceToNode(
    resources: IResource[],
    container: Content
  ): TreeNode[] {
    const data = [];
    for (const iterator of resources) {
      if (iterator.isDeleted) {
        continue;
      }
      const containerParent = cloneDeep(container);
      delete containerParent.resources;
      const node = { ...cloneDeep(iterator), containerParent };
      data.push({
        data: node,
        children: [],
      });
    }
    return data;
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

  async createResource(createResourceInput): Promise<Resource> {
    const mutationRef = this.graphql.refMutation(
      resourceQueries.mutation.createResource,
      { createResourceInput },
      [this._lastContent],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createResource),
        map((resource) => Resource.fromJson(resource))
      )
    );
  }

  async updateResource(data: Partial<IResource>): Promise<Resource> {
    const mutRef = this.graphql.refMutation(
      resourceQueries.mutation.updateResource,
      { updateResourceInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.updateResource),
        map((content) => Resource.fromJson(content))
      )
    );
  }
}
