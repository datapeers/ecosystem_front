const fragments = {
  notificationFields: `
    fragment notificationFields on Notification {
      _id
      text
      url
      readed
      createdAt      
    }
  `,
};

const query = {
  notificationList: `
  query Query($userId: ID!) {
  notifications(userId: $userId) {
      _id
      readed
      text
      updatedAt
      url
      userId
      isDeleted
      createdAt
    }
  }
  ${fragments.notificationFields}
  `,
};

const mutation = {};

const subscription = {
  listenNotificationSubscription: `
    subscription notificationSubscription($userId: String!) {
      notificationSubscription(userId: $userId) {
        ...notificationFields
      }
    }
    ${fragments.notificationFields}
  `,
};

const notificationQueries = {
  query,
  mutation,
  subscription,
};

export default notificationQueries;
