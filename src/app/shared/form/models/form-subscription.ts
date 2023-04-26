import { FormCollections } from "../enums/form-collections";
import { IForm } from "./form";

export interface IFormSubscription {
  _id: string;
  doc: string;
  form: IForm;
  opened: boolean;
  data: any;
  reason: string;
  target: FormCollections;
  createdAt: Date;
  updatedAt: Date;
}