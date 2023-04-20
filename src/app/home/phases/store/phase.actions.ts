import { Action } from '@ngrx/store';
import { Phase } from '../model/phase.model';

export const SET_PHASE = '[Phase] Set phase';
export const SET_ERROR = '[Phase] Set error in store';
export const CLEAR_STORE = '[Phase] Clear store of auth';
export const UPDATE_PHASE_IMAGE = '[Phase] Update phase thumbnail image';
export const UPDATE_PHASE = '[Phase] Update phase state';
export const FAIL_UPDATE_PHASE = '[Phase] Failed to update phase';

export class SetPhaseAction implements Action {
  readonly type = SET_PHASE;
  constructor(public phase: Phase) {}
}

export class ClearPhaseStoreAction implements Action {
  readonly type = CLEAR_STORE;
}

export class UpdatePhaseImageAction implements Action {
  readonly type = UPDATE_PHASE_IMAGE;

  constructor(public imageUrl: string) {}
}

export class UpdatePhaseAction implements Action {
  readonly type = UPDATE_PHASE;

  constructor(public updatedPhase: Phase) {}
}

export class FailUpdatePhaseAction implements Action {
  readonly type = FAIL_UPDATE_PHASE;

  constructor(public message: string) {}
}

export type PhaseActions = SetPhaseAction | ClearPhaseStoreAction | UpdatePhaseImageAction | UpdatePhaseAction | FailUpdatePhaseAction;
