const fragments = {
  entrepreneurFields: `
    fragment entrepreneurFields on Entrepreneur {
      _id
      item
    }
  `,
};

const query = {
  entrepreneurById: `
    query Entrepreneur($id: String!) {
      entrepreneur(id: $id) {
        ...entrepreneurFields
      }
    }
    ${fragments.entrepreneurFields}
  `,
  entrepreneurs: `
    query Entrepreneurs {
      entrepreneurs {
        ...entrepreneurFields
      }
    }
    ${fragments.entrepreneurFields}
  `,
  entrepreneurByAccount: `
    query EntrepreneurAccount($accountId: String!) {
      entrepreneurAccount(accountId: $accountId) {
        ...entrepreneurFields
      }
    }
    ${fragments.entrepreneurFields}
  `,
};

const mutation = {};

export const entrepreneurQueries = {
  query,
  mutation,
};

export default entrepreneurQueries;
