import { paginatedResultFields } from "@shared/models/graphql/paginated-result";
import { updateResultPayloadFields } from "@shared/models/graphql/update-result-payload";

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
  investorsPage: `
    query InvestorsPage($request: PageRequest!) {
      investorsPage(request: $request) {
        ...paginatedResultFields
      }
    }
    ${paginatedResultFields}
  `,
};

const mutation = {
  deleteInvestors: `
    mutation DeleteInvestors($ids: [String!]!) {
      deleteInvestors(ids: $ids) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
};

export const investorQueries = {
  query,
  mutation
};

export default investorQueries;