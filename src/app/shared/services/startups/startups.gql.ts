import { paginatedResultFields } from '@shared/models/graphql/paginated-result';
import { updateResultPayloadFields } from '@shared/models/graphql/update-result-payload';

const fragments = {
  startupFields: `
    fragment startupFields on Startup {
      _id
      item
      entrepreneurs {
        _id
        rol
        item
      }
    }
  `,
};

const query = {
  startups: `
    query Startups {
      startups {
        ...startupFields
      }
    }
    ${fragments.startupFields}
  `,
  startupsPhase: `
    query StartupsPhase($phase: String!) {
      startupsPhase(phase: $phase) {
        ...startupFields
      }
    }
    ${fragments.startupFields}
  `,
  startupsCommunities: `
    query StartupsCommunities {
      startupsCommunities {
        ...startupFields
      }
    }
    ${fragments.startupFields}
  `,
  startupsPage: `
    query StartupsPage($request: PageRequest!) {
      startupsPage(request: $request) {
        ...paginatedResultFields
      }
    }
    ${paginatedResultFields}
  `,
};

const mutation = {
  linkToPhase: `
    mutation LinkPhaseToStartup($startups: [String!]!, $name: String!, $phaseId: String!) {
      linkPhaseToStartup(startups: $startups, name: $name, phaseId: $phaseId) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  deleteStartups: `
    mutation DeleteStartups($ids: [String!]!) {
      deleteStartups(ids: $ids) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkStartupsWithEntrepreneursByRequest: `
    mutation LinkStartupsWithEntrepreneursByRequest($request: PageRequest!, $targetIds: [String!]!) {
      linkStartupsWithEntrepreneursByRequest(request: $request, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkStartupsWithEntrepreneurs: `
    mutation LinkStartupsWithEntrepreneurs($ids: [String!]!, $targetIds: [String!]!) {
      linkStartupsWithEntrepreneurs(ids: $ids, targetIds: $targetIds) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
};

export const startupQueries = {
  query,
  mutation,
};

export default startupQueries;
