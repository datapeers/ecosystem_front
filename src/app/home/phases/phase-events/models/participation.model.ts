export interface IParticipationEvent {
  _id: string;
  participant: string;
  startup: string;
  event: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export class ParticipationEvent implements IParticipationEvent {
  _id: string;
  participant: string;
  startup: string;
  event: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;

  constructor() {}

  public static fromJSON(data: IParticipationEvent) {
    const obj = new ParticipationEvent();
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return obj;
  }
}
