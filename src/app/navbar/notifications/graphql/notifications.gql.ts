const fragments = {
  notificationFields: `
    fragment notificationFields on Notification {
      _id
      text
      date
      url
      target
      state
      type
      createdAt
      updatedAt
    }
  `,
};

const query = {
  notificationsTargets: `
    query NotificationsTargets($targets: [String!]!) {
      notificationsTargets(targets: $targets) {
        ...notificationFields
      }
    }
    ${fragments.notificationFields}
  `,
};

const mutation = {
  createNotification: `
    ${fragments.notificationFields}
    mutation CreateNotification($createNotificationInput: CreateNotificationInput!) {
      createNotification(createNotificationInput: $createNotificationInput) {
        ...notificationFields
      }
    }
  `,
  updateNotification: `
    ${fragments.notificationFields}
    mutation UpdateNotification($updateNotificationInput: UpdateNotificationInput!) {
      updateNotification(updateNotificationInput: $updateNotificationInput) {
        ...notificationFields
      }
    }
  `,
  removeNotification: `
    ${fragments.notificationFields}
    mutation RemoveNotification($removeNotificationId: ID!) {
      removeNotification(id: $removeNotificationId) {
        ...notificationFields
      }
    }
  `,
};

const notificationQueries = {
  query,
  mutation,
};

export default notificationQueries;
