import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import {
  IResourceReply,
  ResourceReply,
  createSimpleResourceReply,
} from './model/resource-reply.model';
import resourceRepliesQueries from './model/resource-reply.gql';
import { first, firstValueFrom, map, tap } from 'rxjs';
import { ResourceReplyState } from './model/resource-reply-states';
import { ResourcesTypes } from '../model/resources-types.model';
import { Resource } from '../model/resource.model';
import { ToastService } from '@shared/services/toast.service';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';
import { User } from '@auth/models/user';
import * as moment from 'moment';
import { FormService } from '@shared/form/form.service';
import { Startup } from '@shared/models/entities/startup';
import { Phase } from '../model/phase.model';
import { Content } from '../model/content.model';
@Injectable({
  providedIn: 'root',
})
export class PhaseHomeworksService {
  _getResourceReplies;
  constructor(
    private toast: ToastService,
    private graphql: GraphqlService,
    private storageService: StorageService,
    private readonly formService: FormService
  ) {}

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

  async getDocumentsStartup(
    startup: string,
    phase: string
  ): Promise<ResourceReply[]> {
    this._getResourceReplies = this.graphql.refQuery(
      resourceRepliesQueries.query.getResourceRepliesByStartup,
      { startup, phase },
      'no-cache',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(this._getResourceReplies).pipe(
        map((request) => request.data.resourcesReplyByStartup),
        map((dataReplies) =>
          dataReplies.map((data) => ResourceReply.fromJson(data))
        )
      )
    );
  }

  async createResourceReply(createResourcesReplyInput: {
    item: any;
    phase: string;
    startup: string;
    sprint: string;
    resource: string;
    type: ResourcesTypes;
    state: ResourceReplyState;
  }): Promise<ResourceReply> {
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

  async updateReply(
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

  async uploadTaskReply(fileToUpload: File, reply: ResourceReply, user: User) {
    return new Promise(async (resolve, reject) => {
      if (moment(new Date()).isAfter(reply.resource.extra_options.end)) {
        this.toast.info({
          summary: 'Fecha limite',
          detail: 'Esta tarea ya supero el tiempo limite para su realización',
        });
        resolve(true);
        return;
      }
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB in bytes
      if (fileToUpload.size > maxSizeInBytes) {
        this.toast.alert({
          summary: 'Archivo invalido',
          detail:
            'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.',
        });
        resolve(true);
        return;
      }
      this.toast.info({
        summary: 'Subiendo...',
        detail: 'Por favor espere',
        life: 10000,
      });
      const fileUploaded: any = await firstValueFrom(
        this.storageService
          .uploadFile(
            `phases/${reply.phase._id}/task/${reply.startup._id}/${reply.resource._id}`,
            fileToUpload
          )
          .pipe(first((event) => event.type === HttpEventType.Response))
      );
      fileUploaded.url;

      const realUrl = fileUploaded.url;
      if (reply._id) {
        this.updateReply({
          _id: reply._id,
          item: { user: user._id, file: realUrl },
          modified: true,
        })
          .then((reply) => {
            this.toast.clear();
            resolve(true);
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.error({
              summary: 'Fallo al registrar archivo subido',
              detail: err,
            });
            resolve(true);
          });
      } else {
        this.createResourceReply({
          item: { user: user._id, file: realUrl },
          phase: reply.phase._id,
          startup: reply.startup._id,
          sprint: reply.sprint._id,
          resource: reply.resource._id,
          type: reply.resource.type,
          state: ResourceReplyState['Sin evaluar'],
        })
          .then((reply) => {
            this.toast.clear();
            resolve(true);
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.error({
              summary: 'Fallo al registrar archivo subido',
              detail: err,
            });
            resolve(true);
          });
      }
    });
  }

  async downloadFileReply(reply: ResourceReply) {
    const file = reply.item.file;
    this.toast.info({ summary: 'Descargando', detail: '' });
    const key = this.storageService.getKey(file);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      this.toast.clear();
      window.open(url, '_blank');
    }
  }

  async openFormResource(reply: ResourceReply) {
    if (moment(new Date()).isAfter(reply.resource.extra_options.end)) {
      this.toast.info({
        summary: 'Fecha limite',
        detail: 'Esta tarea ya supero el tiempo limite para su realización',
      });
      return null;
    }
    this.toast.loading();
    const subscription = await this.formService.createFormSubscription({
      form: reply.resource.extra_options.form,
      reason: 'Abrir formulario recurso desde toolkit',
      data: {
        startup: reply.startup._id,
        sprint: reply.sprint._id,
        resource: reply.resource._id,
        phase: reply.phase._id,
        type: reply.resource.type,
        state: 'Sin evaluar',
      },
      doc: reply._id,
    });
    this.toast.clear();
    return this.formService.openFormFromSubscription(
      subscription,
      `Diligenciar ${reply.resource.name}`
    );
  }

  async downloadFileAndCheck(reply: ResourceReply, user: User) {
    const resource = reply.resource;
    const file = resource?.extra_options?.file;
    this.toast.info({ summary: 'Descargando', detail: '' });
    const key = this.storageService.getKey(file);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      this.toast.clear();
      window.open(url, '_blank');
      if (reply.state === ResourceReplyState['Sin descargar']) {
        await this.createResourceReply({
          item: { user: user._id },
          phase: reply.phase._id,
          startup: reply.startup._id,
          sprint: reply.sprint._id,
          resource: reply.resource._id,
          type: reply.resource.type,
          state: ResourceReplyState.Descargado,
        });
        return true;
      }
    }
    return false;
  }

  async setResourcesReplies(startup: Startup, batch: Phase, sprint: Content) {
    let ans = [];
    const repliesSaved = await this.getDocumentsStartup(startup._id, batch._id);
    for (const resourceSprint of sprint.resources) {
      let reply = repliesSaved.find(
        (i) => i.resource._id === resourceSprint._id
      );
      if (!reply) {
        reply = createSimpleResourceReply(
          startup,
          resourceSprint,
          sprint,
          batch
        );
      }
      ans.push({
        ...reply,
        startup: startup,
        sprint: sprint,
        phase: batch,
      });
    }
    for (const content of sprint.childs) {
      for (const resourceContent of content.resources) {
        let reply = repliesSaved.find(
          (i) => i.resource._id === resourceContent._id
        );
        if (!reply)
          reply = createSimpleResourceReply(
            startup,
            resourceContent,
            sprint,
            batch
          );
        ans.push({
          ...reply,
          startup: startup,
          sprint: sprint,
          phase: batch,
        });
      }
    }
    return ans;
  }
}
