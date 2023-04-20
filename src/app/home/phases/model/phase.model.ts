export interface IPhase {
  _id: string;
  name: string;
  thumbnail?: string;
  description?: string;
  landing?: string;
  createdBy: string;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  published: boolean;
  deleted: boolean;
  basePhase: boolean;
  childrenOf: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Phase implements IPhase {
  _id: string;
  name: string;
  thumbnail?: string;
  description?: string;
  landing?: string;
  createdBy: string;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  published: boolean;
  deleted: boolean;
  basePhase: boolean;
  childrenOf: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: IPhase): Phase {
    const phase = new Phase();
    Object.assign(phase,{
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return phase;
  }
}