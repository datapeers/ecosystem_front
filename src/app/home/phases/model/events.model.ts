export interface ITypeEvent {
  _id: string;
  name: string;
  allowActa: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TypeEvent implements ITypeEvent {
  _id: string;
  name: string;
  allowActa: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: ITypeEvent): TypeEvent {
    const content = new TypeEvent();
    Object.assign(content, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return content;
  }

  toSave(): Partial<TypeEvent> {
    return {
      _id: this._id,
      name: this.name,
    };
  }
}
