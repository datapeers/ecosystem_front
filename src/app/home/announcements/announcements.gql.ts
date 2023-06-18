const fragments = {
  announcementFields: `
    fragment announcementFields on Announcement {
      _id
      name
      description
      thumbnail
      landing
      published
      emailMessage
      type
      target
      redirectLink
      exitText
      startAt
      endAt
      createdAt
      updatedAt
    }
  `,
  detailedAnnouncementFields: `
    fragment detailedAnnouncementFields on Announcement {
      _id
      name
      description
      thumbnail
      landing
      published
      form {
        _id
        name
      }
      emailMessage
      type
      target
      redirectLink
      exitText
      startAt
      endAt
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getAnnouncement: `
    query Announcement($id: String!) {
      announcement(id: $id) {
        ...detailedAnnouncementFields
      }
    }
    ${fragments.detailedAnnouncementFields}
  `,
  getAnnouncements: `
    query Announcements {
      announcements {
        ...announcementFields
      }
    }
    ${fragments.announcementFields}
  `,
};

const mutation = {
  createAnnouncement: `
    ${fragments.announcementFields}
    mutation CreateAnnouncement($createAnnouncementInput: CreateAnnouncementInput!) {
      createAnnouncement(createAnnouncementInput: $createAnnouncementInput) {
        ...announcementFields
      }
    }
  `,
  updateAnnouncement: `
    ${fragments.detailedAnnouncementFields}
    mutation UpdateAnnouncement($updateAnnouncementInput: UpdateAnnouncementInput!) {
      updateAnnouncement(updateAnnouncementInput: $updateAnnouncementInput) {
        ...detailedAnnouncementFields
      }
    }
  `,
  publishAnnouncement: `
    ${fragments.detailedAnnouncementFields}
    mutation PublishAnnouncement($id: String!) {
      publishAnnouncement(id: $id) {
        ...detailedAnnouncementFields
      }
    }
  `,
};

const announcementQueries = {
  query,
  mutation,
};

export default announcementQueries;
