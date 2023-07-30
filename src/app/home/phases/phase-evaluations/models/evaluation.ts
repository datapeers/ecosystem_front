export interface IEvaluation {
  _id?: string;
  item: any;
  evaluated: string;
  reviewer: string;
  form: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class Evaluation implements IEvaluation {
  _id?: string;
  item: any;
  evaluated: string;
  reviewer: string;
  form: string;
  config: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor() {}

  static fromJson(data: IEvaluation): Evaluation {
    const obj = new Evaluation();
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return obj;
  }
}
