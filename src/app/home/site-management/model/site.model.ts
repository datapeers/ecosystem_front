import { cloneDeep } from 'lodash';

export interface ISite {
  _id: string;
  name: string;
  thumbnail: string;
  description: string;
  coords: any;
  services: {
    name: string;
    description: string;
    contact: string;
    email: string;
    coords: any;
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
  coords: any;
  services: {
    name: string;
    description: string;
    contact: string;
    email: string;
    coords: any;
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
      services: data.services.map((i) => new ServiceSite(i)),
    });
    return site;
  }

  static newSite(previousSite?: ISite) {
    const siteBody = {
      _id: previousSite?._id ?? undefined,
      name: previousSite?.name ?? '',
      description: previousSite?.name ?? '',
      thumbnail: previousSite?.name ?? undefined,
      coords: {
        lat: undefined,
        lng: undefined,
        ...previousSite?.coords,
      },
      services: previousSite?.services ?? [],
    };
    return siteBody;
  }

  toSave(): Partial<Site> {
    return {
      _id: this._id,
      name: this.name,
      thumbnail: this.thumbnail,
      description: this.description,
      coords: this.coords,
      services: this.services,
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
