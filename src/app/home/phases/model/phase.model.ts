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
