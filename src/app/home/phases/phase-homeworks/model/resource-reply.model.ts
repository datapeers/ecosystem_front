import { Content } from '@home/phases/model/content.model';
import { Resource } from '@home/phases/model/resource.model';
import { Startup } from '@shared/models/entities/startup';

export interface IResourceReply {
  _id?: string;
  item: any;
  startup: Startup | string;
  resource: Resource | string;
  sprint: Content | string;
  type: string;
  state: string;
  observations: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class ResourceReply implements IResourceReply {
  _id: string;
  item: any;
  startup: Startup | string;
  resource: Resource | string;
  sprint: Content | string;
  type: string;
  state: string;
  observations: string;
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
