import { Startup } from '@shared/models/entities/startup';

export interface IConfigStartup extends Startup {
  hours: { [key: string]: number }; // key its activity id
}
