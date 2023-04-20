import { Phase } from '../model/phase.model';
import * as fromPhase from './phase.actions';
export interface IPhaseState {
  phase: Phase;
}

const initialState: IPhaseState = {
  phase: null,
};

export function phaseReducer(
  state = initialState,
  action: fromPhase.PhaseActions
): IPhaseState {
  switch (action.type) {
    case fromPhase.SET_PHASE:
      return {
        ...state,
        phase: action.phase,
      };
    case fromPhase.UPDATE_PHASE:
      return {
        ...state,
        phase: action.updatedPhase,
      };
    case fromPhase.CLEAR_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
