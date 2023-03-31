export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  signUp: string;
  phone: string;
  rol: 'admin' | 'user' | 'investor';
  extraData: {
    entrepreneur: any;
    startUp: any;
  };
}

export class User implements IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  signUp: string;
  phone: string;
  rol: 'admin' | 'user' | 'investor';
  extraData: {
    entrepreneur: any;
    startUp: any;
  };

  constructor(user: User) {
    this.uid = user.uid;
    this.email = user.email;
    this.displayName = user.displayName;
    this.photoURL = user.photoURL;
    this.emailVerified = user.emailVerified;
    this.signUp = user.signUp;
    this.phone = user.phone;
    this.rol = user.rol;
    this.extraData = user.extraData;
  }

  getEntrepreneur(): any {
    return this.extraData.entrepreneur;
  }

  getStartUp(): any {
    return this.extraData.startUp;
  }
}
