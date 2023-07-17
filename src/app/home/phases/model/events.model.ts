import * as moment from 'moment';
import { Phase } from './phase.model';

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
  extra_options: {
    assistant: 'onsite' | 'virtual' | 'zoom';
    description: string;
    url?: string;
    files?: { name: string; url: string }[];
    acta?: string;
  };
  startAt: Date;
  endAt: Date;
  phase: string;
  experts: { _id: string; name: string; __typename?: string }[];
  participants: { _id: string; name: string; __typename?: string }[];
  teamCoaches: { _id: string; name: string; __typename?: string }[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class Event implements IEvent {
  _id: string;
  name: string;
  type: string;
  extra_options: {
    assistant: 'onsite' | 'virtual' | 'zoom';
    description: string;
    url?: string;
    files?: { name: string; url: string }[];
    acta?: string;
  };
  startAt: Date;
  endAt: Date;
  phase: string;
  experts: { _id: string; name: string }[];
  participants: { _id: string; name: string }[];
  teamCoaches: { _id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  private constructor() {}

  static fromJson(data: IEvent): Event {
    const obj = new Event();
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      startAt: new Date(data.createdAt),
      endAt: new Date(data.endAt),
      extra_options: {
        ...data?.extra_options,
      },
      experts: data.experts.map(({ __typename, ...rest }) => rest),
      teamCoaches: data.teamCoaches.map(({ __typename, ...rest }) => rest),
      participants: data.participants.map(({ __typename, ...rest }) => rest),
    });
    return obj;
  }

  static newEvent(phase: Phase, event?: IEvent) {
    const eventBody = {
      _id: event?._id ?? undefined,
      name: event?.name ?? `${phase?.name} - evento`,
      type: event?.type ?? '',
      startAt: event?.startAt ?? new Date(),
      endAt: event?.endAt ?? moment(new Date()).add(1, 'hours').toDate(),
      phase: phase?._id,
      experts: event?.experts ?? [],
      teamCoaches: event?.teamCoaches ?? [],
      participants: event?.participants ?? [],
      extra_options: {
        assistant: event?.extra_options?.assistant ?? 'onsite',
        description: event?.extra_options?.description ?? '',
        url: event?.extra_options?.url ?? '',
        files: event?.extra_options?.files ?? [],
        acta: event?.extra_options?.acta ?? undefined,
      },
    };
    return eventBody;
  }

  toSave(): Partial<Event> {
    return {
      _id: this._id,
      name: this.name,
      extra_options: this.extra_options,
      startAt: this.startAt,
      endAt: this.endAt,
      isDeleted: this.isDeleted,
      experts: this.experts,
      teamCoaches: this.teamCoaches,
      participants: this.participants,
    };
  }
}

export interface IEventFile {
  url?: string;
  name: string;
}

export interface IEventFileExtended extends IEventFile {
  file?: File;
}
