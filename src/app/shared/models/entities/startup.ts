import { Document } from '../common/document';

export interface Startup extends Document {
  phases: { _id: string; name: string }[];
  item: any;
  entrepreneurs: { _id: string; item: any; rol: string }[];
  thumbnail?: string;
}
