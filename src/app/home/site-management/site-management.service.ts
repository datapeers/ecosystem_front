import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { StorageService } from '@shared/storage/storage.service';
import { firstValueFrom, map } from 'rxjs';
import sitesQueries from './graphql/site.gql';
import { ISite, Site } from './model/site.model';

@Injectable({
  providedIn: 'root',
})
export class SiteManagementService {
  private _getSites;
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService
  ) {}

  async getSite(id: string): Promise<Site> {
    const queryRef = this.graphql.refQuery(
      sitesQueries.query.getSite,
      { id },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.site),
        map((site) => Site.fromJson(site))
      )
    );
  }

  async getSites(): Promise<Site[]> {
    const queryRef = this.graphql.refQuery(
      sitesQueries.query.getSites,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.sites),
        map((sites) => sites.map((site) => Site.fromJson(site)))
      )
    );
  }

  async watchSites() {
    this._getSites = this.graphql.refQuery(
      sitesQueries.query.getSites,
      {},
      'cache-first',
      { auth: true }
    );
    return this.graphql.watch_query(this._getSites).valueChanges.pipe(
      map((request) => request.data.sites),
      map((sites) => sites.map((site) => Site.fromJson(site)))
    );
  }

  async createSite(createSiteInput): Promise<Site> {
    const mutationRef = this.graphql.refMutation(
      sitesQueries.mutation.createSite,
      { createSiteInput },
      [this._getSites],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutationRef).pipe(
        map((request) => request.data.createSite),
        map((site) => Site.fromJson(site))
      )
    );
  }

  async updateSite(id: string, data: Partial<ISite>): Promise<Site> {
    data._id = id;
    const mutRef = this.graphql.refMutation(
      sitesQueries.mutation.updateSite,
      { updateSiteInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(map((request) => request.data.updateSite))
    );
  }

  updateSiteThumbnail(file: File) {
    const renamedFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(
      `sites/thumbnails`,
      renamedFile,
      true
    );
  }

  async deleteSite(id: string): Promise<Site> {
    const mutRef = this.graphql.refMutation(
      sitesQueries.mutation.deleteSite,
      { id },
      [this._getSites],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(mutRef).pipe(
        map((request) => request.data.removeSite),
        map((siteDoc) => Site.fromJson(siteDoc))
      )
    );
  }
}
