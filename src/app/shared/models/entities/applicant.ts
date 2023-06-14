import { ApplicationStates } from "@home/announcements/model/application-states.enum";
import { Document } from "../common/document";

export interface Applicant extends Document {
  _id: string;
  item: JSON;
  documentsFields?: Record<string, string>;
  documents?: FormFile[];
  announcement: string;
  participant: string;
  state?: ApplicantState;
  states: ApplicantState[];
  deletedAt: Date;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  name: string;
  url: string;
  key: string;
}

export interface FormFile {
  url: string;
  key: string;
}

export interface ApplicantState {
  notes: string;
  documents: Attachment[];
  type: ApplicationStates;
}