export enum InvitationStates {
  enabled = "enabled",
  disabled = "disabled",
  accepted = "accepted"
}

export const stateNames: Record<InvitationStates, string> = {
  [InvitationStates.enabled]: "Enabled",
  [InvitationStates.disabled]: "Disabled",
  [InvitationStates.accepted]: "Accepted",
}

export const invitationStateName = (state: InvitationStates) => {
  return stateNames[state];
};