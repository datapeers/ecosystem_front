export enum AnnouncementTypes {
  challenge = "challenge",
  open = "open",
}

export const announcementTypeNames: Record<AnnouncementTypes, string> = {
  [AnnouncementTypes.challenge]: "Reto",
  [AnnouncementTypes.open]: "Abierta",
}

export const announcementTypes = Object.entries(announcementTypeNames).map(([key, value]) => {
  return {
    name: value,
    value: key as AnnouncementTypes,
  }
});