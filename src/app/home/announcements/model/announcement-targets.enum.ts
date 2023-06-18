export enum AnnouncementTargets {
  entrepreneurs = "entrepreneurs",
  experts = "experts",
}

export const announcementTargetNames: Record<AnnouncementTargets, string> = {
  [AnnouncementTargets.entrepreneurs]: "Emprendedores",
  [AnnouncementTargets.experts]: "Expertos",
}

export const announcementTargets = Object.entries(announcementTargetNames).map(([key, value]) => {
  return {
    name: value,
    value: key as AnnouncementTargets,
  }
});
