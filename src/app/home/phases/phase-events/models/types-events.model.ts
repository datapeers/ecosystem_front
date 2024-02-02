export interface ITypeEvent {
  _id: string;
  name: string;
  extra_options: any;
  expertFocus: boolean;
  isDeleted: boolean;
  isSchedulable: boolean;
  scheduleUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TypeEvent implements ITypeEvent {
  _id: string;
  name: string;
  extra_options: {
    allow_acta: boolean;
    allow_files: boolean;
  };
  isSchedulable: boolean;
  scheduleUrl: string;
  description: string;
  expertFocus: boolean;
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
      extra_options: {
        allow_acta: false,
        allow_files: false,
        ...data?.extra_options,
      },
    });
    return content;
  }

  toSave(): Partial<TypeEvent> {
    return {
      _id: this._id,
      name: this.name,
      extra_options: this.extra_options,
      expertFocus: this.expertFocus,
      isSchedulable: this.isSchedulable,
      scheduleUrl: this.scheduleUrl,
    };
  }

  static newEventType(): Partial<TypeEvent> {
    return {
      name: '',
      extra_options: {
        allow_acta: false,
        allow_files: false,
      },
      expertFocus: false,
      isSchedulable: false,
      scheduleUrl: '',
    };
  }
}
