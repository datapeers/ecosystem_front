import * as moment from 'moment';
import { Phase } from '../../model/phase.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { attendanceType } from './assistant-type.enum';

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
    files?: { name: string; url: string }[];
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
    publicFiles?: boolean;
    files?: { name: string; url: string }[];
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
  isCanceled: boolean;

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
}

export interface IEventFile {
  url?: string;
  name: string;
}

export interface IEventFileExtended extends IEventFile {
  file?: File;
}

export function newEvent(batch: Phase, previous?: IEvent) {
  return new FormGroup({
    _id: new FormControl<string>(previous?._id ?? undefined),
    name: new FormControl<string>(previous?.name ?? `${batch?.name} - evento`, {
      validators: [Validators.required],
    }),
    type: new FormControl<string>(previous?.type ?? '', {
      validators: [Validators.required],
    }),
    startAt: new FormControl<Date>(previous?.startAt ?? new Date(), {
      validators: [Validators.required],
    }),
    endAt: new FormControl<Date>(moment(new Date()).add(1, 'hours').toDate(), {
      validators: [Validators.required],
    }),
  });
}
