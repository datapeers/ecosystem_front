export interface IResource {
  _id: string;
  name: string;
  content: string;
  phase: string;
  type: 'downloadable' | 'task' | 'form';
  extra_options: any;
  hide: boolean;
  isDeleted: boolean;
  expiration: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Resource implements IResource {
  _id: string;
  name: string;
  content: string;
  phase: string;
  type: 'downloadable' | 'task' | 'form';
  extra_options: any;
  hide: boolean;
  isDeleted: boolean;
  expiration: Date;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: IResource): Resource {
    const resource = new Resource();
    Object.assign(resource, {
      ...data,
      expiration: new Date(data.expiration),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return resource;
  }
}
