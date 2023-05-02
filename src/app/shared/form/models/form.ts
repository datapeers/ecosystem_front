import { FormCollections, formCollectionNames } from "../enums/form-collections";
import { FormDocument } from "./form-document";
import { IFormTag } from "./form-tag";

export interface IForm {
  _id?: string;
  name: string;
  description: string;
  formJson: string;
  target: FormCollections;
  documents: any[];
  keys?: any[];
  tags: IFormTag[];
  isDeleted?: boolean;
}

export class AppForm implements IForm {
  _id?: string;
  name: string;
  description: string;
  formJson: string;
  target: FormCollections;
  documents: FormDocument[];
  keys?: any[];
  tags: IFormTag[];
  isDeleted?: boolean;

  form: any;

  get collectionName(): string {
    return formCollectionNames[this.target];
  }

  get components() {
    return this.form.components;
  }

  private constructor(data: IForm) {
    Object.assign(this, data);
    this.form = JSON.parse(data.formJson);
    return this;
  };

  static fromJson(data: IForm) {
    return new AppForm(data);
  }
}