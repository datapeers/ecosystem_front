import { Content } from '@home/phases/model/content.model';
import { Phase } from '@home/phases/model/phase.model';
import { Resource } from '@home/phases/model/resource.model';
import { ResourcesTypes } from '@home/phases/model/resources-types.model';
import { Startup } from '@shared/models/entities/startup';

export interface IResourceReply {
  _id?: string;
  item: any;
  startup: Startup;
  resource: Resource;
  sprint: Content;
  phase: Phase;
  type: string;
  state: string;
  observations: string;
  modified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class ResourceReply implements IResourceReply {
  _id: string;
  item: any;
  startup: Startup;
  resource: Resource;
  sprint: Content;
  phase: Phase;
  type: string;
  state: string;
  observations: string;
  modified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  constructor() {}
  static fromJson(data: IResourceReply): ResourceReply {
    const obj = new ResourceReply();
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return obj;
  }
}

export function createSimpleResourceReply(
  startup: Startup,
  resource: Resource,
  sprint: Content,
  phase: Phase
) {
  const newReply = new ResourceReply();
  newReply._id = undefined;
  newReply.item = {} as any;
  newReply.type = resource.type;
  newReply.observations = '';
  newReply.startup = startup;
  newReply.sprint = sprint;
  newReply.resource = resource;
  newReply.phase = phase;
  newReply.createdAt = new Date();
  newReply.updatedAt = new Date();
  newReply.isDeleted = false;
  newReply.modified = false;
  switch (resource.type) {
    case ResourcesTypes.downloadable:
      newReply.state = 'Sin descargar';
      break;
    default:
      newReply.state = 'Pendiente';
      break;
  }
  return newReply;
}
