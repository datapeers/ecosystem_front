import { cloneDeep } from 'lodash';

export interface ISite {
  _id: string;
  name: string;
  thumbnail: string;
  description: string;
  // coords: any;
  // services: {
  //   name: string;
  //   description: string;
  //   contact: string;
  //   email: string;
  //   coords: any;
  // }[];
  directedTo: string;
  methodology: string;
  factors: string[];
  results: string;
  contacts: {
    name: string;
    others: string;
    contact: string;
    email: string;
  }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Site implements ISite {
  _id: string;
  name: string;
  thumbnail: string;
  description: string;
  // coords: any;
  // services: {
  //   name: string;
  //   description: string;
  //   contact: string;
  //   email: string;
  //   coords: any;
  // }[];
  directedTo: string;
  methodology: string;
  factors: string[];
  results: string;
  contacts: {
    name: string;
    others: string;
    contact: string;
    email: string;
  }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: ISite): Site {
    const site = new Site();
    Object.assign(site, {
      ...cloneDeep(data),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      // services: data.services.map((i) => new ServiceSite(i)),
      contacts: data.contacts.map((i) => new ContactService(i)),
    });
    return site;
  }

  static newSite(previousSite?: ISite) {
    const siteBody = {
      _id: previousSite?._id ?? undefined,
      name: previousSite?.name ?? '',
      description: previousSite?.description ?? '',
      thumbnail: previousSite?.thumbnail ?? undefined,
      directedTo: previousSite?.directedTo ?? '',
      methodology: previousSite?.methodology ?? '',
      factors: previousSite?.factors ?? [],
      results: previousSite?.results ?? '',

      // coords: {
      //   lat: undefined,
      //   lng: undefined,
      //   ...previousSite?.coords,
      // },
      // services: previousSite?.services ?? [],
      contacts: previousSite?.contacts ?? [],
    };
    return siteBody;
  }

  toSave(): Partial<Site> {
    return {
      _id: this._id,
      name: this.name,
      thumbnail: this.thumbnail,
      description: this.description,
      directedTo: this.directedTo,
      methodology: this.methodology,
      factors: this.factors,
      results: this.results,
      // coords: this.coords,
      // services: this.services,
    };
  }
}

export interface IServiceSite {
  name: string;
  description: string;
  contact: string;
  email: string;
  coords: any;
}
export class ServiceSite implements IServiceSite {
  name: string;
  description: string;
  contact: string;
  email: string;
  coords: any;

  constructor(service?: IServiceSite) {
    const previousService = cloneDeep(service);
    this.name = previousService?.name ?? '';
    this.description = previousService?.description ?? '';
    this.contact = previousService?.contact ?? '';
    this.email = previousService?.email ?? '';
    this.coords = previousService?.coords ?? {
      lat: previousService?.coords?.lat ?? undefined,
      lng: previousService?.coords?.lng ?? undefined,
    };
  }
}

export interface IContactService {
  name: string;
  contact: string;
  email: string;
  others: string;
}
export class ContactService implements IContactService {
  name: string;
  contact: string;
  email: string;
  others: any;

  constructor(contact?: IContactService) {
    const previousContact = cloneDeep(contact);
    this.name = previousContact?.name ?? '';
    this.contact = previousContact?.contact ?? '';
    this.email = previousContact?.email ?? '';
    this.others = previousContact?.others ?? '';
  }
}
