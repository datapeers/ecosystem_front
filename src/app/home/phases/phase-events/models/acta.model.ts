import * as moment from 'moment';
import { Phase } from '../../model/phase.model';
import { Event } from './events.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface IActa {
  _id: string;
  name: string;
  objective: string;
  solution: string;
  date: Date;
  topics_covered: string;
  conclusions: string;
  extra_options: {
    files?: { name: string; url: string }[];
    expertHours?: any;
  };
  phase: string;
  event: string;
  closed: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class Acta implements IActa {
  _id: string;
  name: string;
  objective: string;
  solution: string;
  date: Date;
  topics_covered: string;
  conclusions: string;
  extra_options: {
    files?: { name: string; url: string }[];
    expertHours?: any;
  };
  phase: string;
  event: string;
  closed: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  private constructor() {}

  static fromJson(data: IActa): Acta {
    const obj = new Acta();
    Object.assign(obj, {
      _id: data?._id ?? undefined,
      name: data?.name ?? '',
      objective: data?.objective ?? '',
      solution: data?.solution ?? '',
      topics_covered: data?.topics_covered ?? '',
      conclusions: data?.conclusions ?? '',
      event: data ? data.event : undefined,
      phase: data ? data.phase : undefined,
      closed: false,
      ...data,
      date: data?.date ? new Date(data.date) : new Date(),
      createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data?.updatedAt ? new Date(data.updatedAt) : new Date(),
      extra_options: {
        files: data?.extra_options?.files ?? [],
        expertHours: data?.extra_options?.expertHours ?? undefined,
      },
    });
    return obj;
  }
}
/*
static newActa(phase: Phase, event: Event, acta ?: IActa) {
    const actaBody = {
      _id: acta?._id ?? undefined,
      name: acta?.name ?? `${phase.name} - ${event.name} - acta`,
      objective: acta?.objective ?? '',
      solution: acta?.solution ?? '',
      date: acta?.date ? new Date(acta.date) : new Date(),
      topics_covered: acta?.topics_covered ?? '',
      conclusions: acta?.conclusions ?? '',
      event: event._id,
      phase: phase._id,
      extra_options: {
        files: acta?.extra_options?.files ?? [],
        expertHours: acta?.extra_options?.expertHours ?? undefined,
      },
      closed: acta?.closed ?? false,
    };
    return actaBody;
  }
*/

export function newActa(batch: Phase, event: Event, previous?: IActa) {
  return new FormGroup({
    name: new FormControl<string>(
      previous?.name ?? `${batch?.name} - ${event.name} - acta`,
      {
        validators: [Validators.required],
      }
    ),
    objective: new FormControl<string>(previous?.objective ?? ''),
    solution: new FormControl<string>(previous?.solution ?? ''),
    date: new FormControl<Date>(previous?.date ?? new Date(), {
      validators: [Validators.required],
    }),
    topics_covered: new FormControl<string>(previous?.topics_covered ?? ''),
    conclusions: new FormControl<string>(previous?.conclusions ?? ''),
  });
}
