const fragments = {
  investorFields: `
    fragment investorFields on Investor {
      _id
      item
    }
  `
}

const query = {
  investors: `
    query Investors {
      investors {
        ...investorFields
      }
    }
    ${fragments.investorFields}
  `,
};

const mutation = {

};

export const investorQueries = {
  query,
  mutation
};

export default investorQueries;