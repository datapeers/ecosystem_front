import * as moment from 'moment';
import { Phase } from '../../model/phase.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TypeEvent } from './types-events.model';
import { attendanceType } from '../models/assistant-type.enum';
import { IParticipationEvent } from './participation.model';
import { IFileUpload } from '@shared/models/file';
export interface IEntityEvent {
  _id: string;
  name: string;
  __typename?: string;
}

export interface IEvent {
  _id: string;
  name: string;
  type: string;
  attendanceType: attendanceType;
  description: string;
  extra_options: {
    url?: string;
    publicFiles?: boolean;
    files?: IFileUpload[];
    acta?: string;
  };
  startAt: Date;
  endAt: Date;
  batch: string;
  experts: IEntityEvent[];
  participants: IEntityEvent[];
  teamCoaches: IEntityEvent[];
  createdAt: Date;
  updatedAt: Date;
  participation: Partial<IParticipationEvent>[];
  isCanceled: boolean;
}

export class Event implements IEvent {
  _id: string;
  name: string;
  type: string;
  attendanceType: attendanceType;
  description: string;
  extra_options: {
    url?: string;
    allow_viewFiles?: boolean;
    files?: IFileUpload[];
    acta?: string;
    link?: string;
  };
  startAt: Date;
  endAt: Date;
  batch: string;
  experts: IEntityEvent[];
  participants: IEntityEvent[];
  teamCoaches: IEntityEvent[];
  createdAt: Date;
  updatedAt: Date;
  participation: Partial<IParticipationEvent>[];
  isCanceled: boolean;
  rating: number;
  private constructor() {}

  static fromJson(data: IEvent): Event {
    const obj = new Event();
    const totalRatings = data.participation
      .filter((i) => i.metadata.rating)
      .reduce((sum, item) => sum + item.metadata.rating, 0);
    const averageRating = data.participation.length
      ? totalRatings / data.participation.length
      : 0;
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      extra_options: {
        ...data?.extra_options,
      },
      experts: data.experts.map(({ __typename, ...rest }) => rest),
      teamCoaches: data.teamCoaches.map(({ __typename, ...rest }) => rest),
      participants: data.participants.map(({ __typename, ...rest }) => rest),
      rating: averageRating,
    });
    return obj;
  }
}

export function newEvent(
  batch: Phase,
  typesEvents: TypeEvent[],
  previous?: IEvent
) {
  const typeEvent = previous
    ? typesEvents.find((i) => i._id === previous.type)
    : typesEvents[0];
  return new FormGroup({
    _id: new FormControl<string>(previous?._id ?? undefined),
    name: new FormControl<string>(
      previous?.name ?? `${batch?.name} - ${typeEvent.name}`,
      {
        validators: [Validators.required],
      }
    ),
    description: new FormControl<string>(previous?.description ?? ''),
    type: new FormControl<string>(previous?.type ?? typeEvent._id, {
      validators: [Validators.required],
    }),
    attendanceType: new FormControl<string>(
      previous?.attendanceType ?? attendanceType.onsite,
      {
        validators: [Validators.required],
      }
    ),
    startAt: new FormControl<Date>(previous?.startAt ?? new Date(), {
      validators: [Validators.required],
    }),
    endAt: new FormControl<Date>(moment(new Date()).add(1, 'hours').toDate(), {
      validators: [Validators.required],
    }),
  });
}

export interface CreateEvent extends Partial<IEvent> {
  name: string;
  type: string;
  attendanceType: attendanceType;
  description: string;
  startAt: Date;
  endAt: Date;
  extra_options: Record<string, any>;
  batch: string;
  experts: IEntityEvent[];
  teamCoaches: IEntityEvent[];
  participants: IEntityEvent[];
}

export interface IItemStartup extends IEntityEvent {
  entrepreneurs: IEntityEvent[];
}
