export interface ISite {
  _id: string;
  name: string;
  thumbnail: string;
  description: string;
  coords: any;
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
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromJson(data: ISite): Site {
    const site = new Site();
    Object.assign(site, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
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
    };
    return siteBody;
  }
}
