import { downloadResultFields } from '@shared/models/graphql/download-result';
import { paginatedResultFields } from '@shared/models/graphql/paginated-result';
import { updateResultPayloadFields } from '@shared/models/graphql/update-result-payload';

const fragments = {
  startupFields: `
    fragment startupFields on Startup {
      _id
      item
      isProspect
      phases {
        _id
        name
      }
      entrepreneurs {
        _id
        rol
        item
        description
      }
    }
  `,
  communitiesFields: `
    fragment communitiesFields on Startup {
      _id
      item
      isProspect
      phases {
        _id
        name
      }
      entrepreneurs {
        _id
        rol
        item
        description
      }
      lastPhase
    }
  `,
};

const query = {
  startup: `
    query Startup($id: String!) {
      startup(id: $id) {
        ...startupFields
      }
    }
    ${fragments.startupFields}
  `,
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
        ...communitiesFields
      }
    }
    ${fragments.communitiesFields}
  `,
  startupsPage: `
    query StartupsPage($request: PageRequest!) {
      startupsPage(request: $request) {
        ...paginatedResultFields
      }
    }
    ${paginatedResultFields}
  `,
  startupsDownload: `
    query StartupsDownload($request: PageRequest!, $configId: String!, $format: TableExportFormats!) {
      startupsDownload(request: $request, configId: $configId, format: $format) {
        ...downloadResultFields
      }
    }
    ${downloadResultFields}
  `,
  contactCommunity: `
    query Query($body: String!, $from: String!, $subject: String!, $to: String!) {
      contactCommunity(body: $body, from: $from, subject: $subject, to: $to)
    }
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
  updateDataEntrepreneurStartup: `
    mutation UpdateDataEntrepreneurStartup($id: String!, $description: String!, $rol: String!, $startup: String!) {
      updateDataEntrepreneurStartup(_id: $id, description: $description, rol: $rol, startup: $startup) {
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
