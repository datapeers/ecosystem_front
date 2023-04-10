export enum InvitationStates {
  enabled = "enabled",
  disabled = "disabled",
  accepted = "accepted"
}

export const statusNames: Record<InvitationStates, string> = {
  [InvitationStates.enabled]: "Enabled",
  [InvitationStates.disabled]: "Disabled",
  [InvitationStates.accepted]: "Accepted",
}

export const invitationStateName = (state: InvitationStates) => {
  return statusNames[state];
};