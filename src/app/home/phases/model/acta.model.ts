import * as moment from 'moment';

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
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      extra_options: {
        ...data?.extra_options,
      },
    });
    return obj;
  }

  static newActa(phase: string, event: string, acta?: IActa) {
    const actaBody = {
      _id: acta?._id ?? undefined,
      name: acta?.name ?? '',
      objective: acta?.objective ?? '',
      solution: acta?.solution ?? '',
      date: acta?.date ? new Date(acta.date) : new Date(),
      topics_covered: acta?.topics_covered ?? '',
      conclusions: acta?.conclusions ?? '',
      event,
      phase,
      extra_options: {
        files: acta?.extra_options?.files ?? [],
        expertHours: acta?.extra_options?.expertHours ?? undefined,
      },
    };
    return actaBody;
  }
}
