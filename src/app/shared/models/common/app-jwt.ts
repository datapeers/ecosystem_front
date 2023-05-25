import jwtUtilities from "@shared/components/utility/jwt";

export class AppJwt {
  constructor(token: string) {
    this.token = token;
    this.payload = jwtUtilities.getPayload(this.token);
  }
  token: string;
  payload: AppJwtPayload;
  get milisecondsTillExpiration() {
    return this.payload.exp * 1000 - Date.now();
  }
}

export interface AppJwtPayload {
  iss:            string;
  aud:            string;
  auth_time:      number;
  user_id:        string;
  sub:            string;
  iat:            number;
  exp:            number;
  email:          string;
  email_verified: boolean;
  firebase:       Firebase;
}

interface Firebase {
  identities:       Identities;
  sign_in_provider: string;
}

interface Identities {
  email: string[];
}
