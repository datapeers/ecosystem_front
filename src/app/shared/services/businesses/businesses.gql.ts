import { downloadResultFields } from "@shared/models/graphql/download-result";
import { paginatedResultFields } from "@shared/models/graphql/paginated-result";
import { updateResultPayloadFields } from "@shared/models/graphql/update-result-payload";

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
  businessesPage: `
    query EntrepreneursPage($request: PageRequest!) {
      businessesPage(request: $request) {
        ...paginatedResultFields
      }
    }
    ${paginatedResultFields}
  `,
  businessesDownload: `
    query BusinessesDownload($request: PageRequest!, $configId: String!, $format: TableExportFormats!) {
      businessesDownload(request: $request, configId: $configId, format: $format) {
        ...downloadResultFields
      }
    }
    ${downloadResultFields}
  `
};

const mutation = {
  deleteBusinesses: `
    mutation DeleteBusinesses($ids: [String!]!) {
      deleteBusinesses(ids: $ids) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkBusinessesWithEntrepreneursByRequest: `
    mutation LinkBusinessesWithEntrepreneursByRequest($request: PageRequest!, $targetIds: [String!]!) {
      linkBusinessesWithEntrepreneursByRequest(request: $request, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkBusinessesWithEntrepreneurs: `
    mutation LinkBusinessesWithEntrepreneurs($ids: [String!]!, $targetIds: [String!]!) {
      linkBusinessesWithEntrepreneurs(ids: $ids, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
};

export const businessQueries = {
  query,
  mutation
};

export default businessQueries;