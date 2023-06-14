export enum ApplicationStates {
  enrolled = "enrolled",
  preregistered = "preregistered",
  selected = "selected",
}

const nextApplicationState = (current: ApplicationStates): ApplicationStates | null => {
  switch(current) {
    case ApplicationStates.enrolled: return ApplicationStates.preregistered;
    case ApplicationStates.preregistered: return ApplicationStates.selected;
    case ApplicationStates.selected: return null;
  }
}

const stateChangeLabel = (current: ApplicationStates): string => {
  switch(current) {
    case ApplicationStates.enrolled: return "Inscribir";
    case ApplicationStates.preregistered: return "Seleccionar";
    case ApplicationStates.selected: return null;
  }
}

export const applicationStatesUtilities = {
  nextApplicationState,
  stateChangeLabel,
};