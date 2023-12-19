const fragments = {
  userFields: `
    fragment userFields on User {
      _id
      uid
      fullName
      email
      rol {
        _id
        name
        type
        permissions
      }
      createdAt
      updatedAt
      isActive
      passwordSet
      googleIn
      profileImageUrl
      relationsAssign
      permissions
    }
  `,
};

const query = {
  getUserByUid: `
    query GetUserByUid($uid: String!) {
      user(uid: $uid) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
  users: `
    query Users($search: String, $roles: [ValidRoles!]) {
      users(search: $search, roles: $roles) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
  inviteUser: `
    mutation InviteUser($body: String!, $from: String!, $startupId: String!, $startupName: String!, $subject: String!, $to: String!) {
      inviteUser(body: $body, from: $from, startupID: $startupId, startupName: $startupName, subject: $subject, to: $to)
    }
  `,
};

const mutation = {
  createUser: `
    mutation CreateUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
  updateUser: `
    mutation UpdateUser($updateUserInput: UpdateUserInput!) {
      updateUser(updateUserInput: $updateUserInput) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
  createUserFromInvitation: `
    mutation CreateUserFromInvitation($code: String!, $name: String!, $password: String!) {
      createUserFromInvitation(code: $code, name: $name, password: $password) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
  disableUser: `
    mutation DisableUser($uid: String!) {
      disableUser(uid: $uid) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
  enableUser: `
    mutation EnableUser($uid: String!) {
      enableUser(uid: $uid) {
        ...userFields
      }
    }
    ${fragments.userFields}
  `,
};

const userQueries = {
  query,
  mutation,
};

export default userQueries;
