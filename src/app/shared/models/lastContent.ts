import { IContent } from '@home/phases/model/content.model';

export interface lastContent {
  lastContent: IContent;
  contentCompleted: number;
  numberOfContent: number;
  numberOfResourcesPending: number;
}
