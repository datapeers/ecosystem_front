export enum StoragePaths {
  profileImages = 'users/profile',
  contentImages = 'content/images',
  announcementThumbnails = "announcements/thumbnail"
}

export const resolveStorage = {
  applicantFiles: (announcementId: string, applicantId: string) =>
    `announcements/${announcementId}/applicants/${applicantId}/files`,
}