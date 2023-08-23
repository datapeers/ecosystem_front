import { Expert } from '@shared/models/entities/expert';
import { Startup } from '@shared/models/entities/startup';

export interface IConfigStartup extends Startup {
  hours: { [key: string]: number }; // key its activity id
}

export interface IConfigExpert extends Expert {
  hours: {
    [key: string]: {
      allocated: number;
      donated: number;
      done: number;
    };
  }; // key its activity id
  startups: Startup[];
}

export interface IConfigTeamCoach {
  _id: string;
  item: {
    nombre: string;
  };
  hours: {
    [key: string]: {
      allocated: number;
      done: number;
    };
  }; // key its activity id
  startups: Startup[];
}
