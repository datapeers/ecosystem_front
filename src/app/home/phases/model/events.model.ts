export interface ITypeEvent {
  _id: string;
  name: string;
  extra_options: any;
  isDeleted: boolean;
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
    };
  }

  static newEventType(): Partial<TypeEvent> {
    return {
      name: '',
      extra_options: {
        allow_acta: false,
        allow_files: false,
      },
    };
  }
}

export interface IEvent {
  _id: string;
  name: string;
  type: string;
  extra_options: any;
  startAt: Date;
  endAt: Date;
  phase: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class Event implements IEvent {
  _id: string;
  name: string;
  type: string;
  extra_options: any;
  startAt: Date;
  endAt: Date;
  phase: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  private constructor() {}

  static fromJson(data: IEvent): Event {
    const content = new Event();
    Object.assign(content, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      startAt: new Date(data.createdAt),
      endAt: new Date(data.createdAt),
      extra_options: {
        ...data?.extra_options,
      },
    });
    return content;
  }

  toSave(): Partial<Event> {
    return {
      _id: this._id,
      name: this.name,
      extra_options: this.extra_options,
      startAt: this.startAt,
      endAt: this.endAt,
      isDeleted: this.isDeleted,
    };
  }

  static newEvent() {
    return {
      name: '',
      type: '',
      startAt: new Date(),
      endAt: new Date(),
      phase: '',
      extra_options: {
        assistant: 'onsite',
        description: '',
        url: '',
      },
    };
  }
}
