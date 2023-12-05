export interface ITermsOfUse {
  _id?: string;
  name: string;
  content: string;
  extra_options: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class TermsOfUse implements ITermsOfUse {
  _id?: string;
  name: string;
  content: string;
  extra_options: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJSON(data: ITermsOfUse): TermsOfUse {
    const terms = new TermsOfUse();
    Object.assign(terms, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    return terms;
  }
}
