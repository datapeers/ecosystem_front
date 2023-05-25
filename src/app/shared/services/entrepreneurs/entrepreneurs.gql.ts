const fragments = {
  entrepreneurFields: `
    fragment entrepreneurFields on Entrepreneur {
      _id
      item
    }
  `
}

const query = {
  entrepreneurs: `
    query Entrepreneurs {
      entrepreneurs {
        ...entrepreneurFields
      }
    }
    ${fragments.entrepreneurFields}
  `,
};

const mutation = {

};

export const entrepreneurQueries = {
  query,
  mutation
};

export default entrepreneurQueries;