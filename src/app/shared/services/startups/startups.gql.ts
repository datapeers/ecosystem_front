const fragments = {
  startupFields: `
    fragment startupFields on Startup {
      _id
      item
    }
  `
}

const query = {
  startups: `
    query Startups {
      startups {
        ...startupFields
      }
    }
    ${fragments.startupFields}
  `,
};

const mutation = {

};

export const startupQueries = {
  query,
  mutation
};

export default startupQueries;