import { paginatedResultFields } from "@shared/models/graphql/paginated-result";
import { updateResultPayloadFields } from "@shared/models/graphql/update-result-payload";

const fragments = {
  entrepreneurFields: `
    fragment entrepreneurFields on Entrepreneur {
      _id
      item
      businesses
      startups
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
  entrepreneursPage: `
    query EntrepreneursPage($request: PageRequest!) {
      entrepreneursPage(request: $request) {
        ...paginatedResultFields
      }
    }
    ${paginatedResultFields}
  `,
};

const mutation = {
  deleteEntrepreneurs: `
    mutation DeleteEntrepreneurs($ids: [String!]!) {
      deleteEntrepreneurs(ids: $ids) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkEntrepreneursWithBusinessesByRequest: `
    mutation LinkEntrepreneursWithBusinessesByRequest($request: PageRequest!, $targetIds: [String!]!) {
      linkEntrepreneursWithBusinessesByRequest(request: $request, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkEntrepreneursWithBusinesses: `
    mutation LinkEntrepreneursWithBusinesses($ids: [String!]!, $targetIds: [String!]!) {
      linkEntrepreneursWithBusinesses(ids: $ids, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkEntrepreneursWithStartupsByRequest: `
    mutation LinkEntrepreneursWithStartupsByRequest($request: PageRequest!, $targetIds: [String!]!) {
      linkEntrepreneursWithStartupsByRequest(request: $request, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkEntrepreneursWithStartups: `
    mutation LinkEntrepreneursWithStartups($ids: [String!]!, $targetIds: [String!]!) {
      linkEntrepreneursWithStartups(ids: $ids, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
};

export const entrepreneurQueries = {
  query,
  mutation,
};

export default entrepreneurQueries;
