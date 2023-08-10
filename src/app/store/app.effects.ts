import { AuthEffects } from '@auth/store/auth.effects';
import { HomeEffects } from '@home/store/home.effects';
import { AnnouncementEffects } from '@home/announcements/store/announcement.effects';
import { PhaseEffects } from '@home/phases/store/phase.effects';

export const appEffects: any[] = [
  AuthEffects,
  HomeEffects,
  PhaseEffects,
  AnnouncementEffects,
];
