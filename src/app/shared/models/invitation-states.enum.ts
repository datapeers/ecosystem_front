export enum InvitationStates {
  enabled = 'enabled',
  disabled = 'disabled',
  accepted = 'accepted',
}

export const stateNames: Record<InvitationStates, string> = {
  [InvitationStates.enabled]: 'Pendiente',
  [InvitationStates.disabled]: 'Inhabilitado',
  [InvitationStates.accepted]: 'Acepto',
};

export const invitationStateName = (state: InvitationStates) => {
  return stateNames[state];
};
