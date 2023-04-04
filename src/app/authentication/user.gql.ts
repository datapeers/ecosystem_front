const query = {
  getUserByUid: `
    query GetUserByUid($uid: String!) {
      user(uid: $uid) {
        _id
        email
        fullName
        isActive
        roles
        uid
      }
    }`
};

const mutation = {
  createUser: `
    mutation CreateUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        _id
        email
        fullName
        isActive
        roles
        uid
      }
  }`
};

const userQueries = {
  query,
  mutation,
}

export default userQueries;