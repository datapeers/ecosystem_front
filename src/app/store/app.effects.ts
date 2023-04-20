import { AuthEffects } from "@auth/store/auth.effects";
import { PhaseEffects } from "@home/phases/store/phase.effects";

export const appEffects: any[] = [
  AuthEffects,
  PhaseEffects,
];
