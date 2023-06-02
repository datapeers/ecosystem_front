const fragments = {
  businessFields: `
    fragment businessFields on Business {
      _id
      item
    }
  `
}

const query = {
  businesses: `
    query Businesses {
      businesses {
        ...businessFields
      }
    }
    ${fragments.businessFields}
  `,
};

const mutation = {

};

export const businessQueries = {
  query,
  mutation
};

export default businessQueries;