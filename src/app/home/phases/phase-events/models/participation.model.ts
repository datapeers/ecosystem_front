import { Startup } from '@shared/models/entities/startup';
import { Event, IItemStartup } from './events.model';

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

  // customFields
  participantName: string;
  startupName: string;
  rating: number;
  constructor() {}

  public static fromJSON(
    data: IParticipationEvent,
    event: Event,
    startups: IItemStartup[]
  ) {
    const obj = new ParticipationEvent();
    const participant = event.participants.find(
      (i) => data.participant === i._id
    );
    const startup = startups.find((i) => i._id === data.startup);
    Object.assign(obj, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      participantName: participant.name,
      startupName: startup.name,
      rating: data.metadata.rating ?? 0,
    });
    return obj;
  }
}
