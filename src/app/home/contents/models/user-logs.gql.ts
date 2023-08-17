const fragments = {
  userLogFields: `
  fragment userLogFields on UserLog {
      _id
      metadata
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getLogs: `
    query UserLogs($filters: JSON!) {
      userLogs(filters: $filters) {
        ...userLogFields
      }
    }
    ${fragments.userLogFields}
  `,
};

const mutation = {
  createUserLog: `
    ${fragments.userLogFields}
    mutation CreateUserLog($createUserLogInput: CreateUserLogInput!) {
      createUserLog(createUserLogInput: $createUserLogInput) {
        ...userLogFields
      }
    }
  `,
};

const userLogsQueries = {
  query,
  mutation,
};

export default userLogsQueries;
