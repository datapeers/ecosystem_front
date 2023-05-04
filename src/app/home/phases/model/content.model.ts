export interface IContent {
  _id: string;
  childs: Content[];
  name: string;
  content: string;
  extra_options: any;
  hide: boolean;
  phase: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Content implements IContent {
  _id: string;
  childs: Content[];
  name: string;
  content: string;
  extra_options: any;
  hide: boolean;
  phase: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: IContent): Content {
    const content = new Content();
    Object.assign(content, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return content;
  }
}
