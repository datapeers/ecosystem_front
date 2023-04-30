const fragments = {
  authCodeFields: `
    fragment authCodeFields on AuthCode {
      _id
      token
    }
  `
};

const query = {
  
};

const mutation = {
  createAuthCode: `
    mutation createAuthCode {
      createAuthCode {
        ...authCodeFields
      }
    }
    ${fragments.authCodeFields}
  `,
};

const authCodeQueries = {
  query,
  mutation,
}

export default authCodeQueries;