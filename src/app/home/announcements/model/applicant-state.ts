import { ApplicationStates } from "./application-states.enum";

export class ApplicantState {
  notes: string;
  documents: Attachment[];
  type: ApplicationStates;
}

export class Attachment implements IAttachment {
  name: string;
  url: string;
  key: string;
}

export interface IAttachment {
  name: string;
  url: string;
  key: string;
}