const fragments = {
  expertFields: `
    fragment expertFields on Expert {
      _id
      phases {
        _id
        name
      }
      item
    }
  `,
};

const query = {
  experts: `
    query Experts {
      experts {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
};

const mutation = {};

export const expertQueries = {
  query,
  mutation,
};

export default expertQueries;
