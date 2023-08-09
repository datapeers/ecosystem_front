import { downloadResultFields } from '@shared/models/graphql/download-result';
import { paginatedResultFields } from '@shared/models/graphql/paginated-result';
import { updateResultPayloadFields } from '@shared/models/graphql/update-result-payload';

const fragments = {
  expertFields: `
    fragment expertFields on Expert {
      _id
      phases {
        _id
        name
        startUps {
          _id
          name
        }
      }
      item
      calendlyLink
    }
  `,
};

const query = {
  expertById: `
    query Expert($id: String!) {
      expert(id: $id) {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
  experts: `
    query Experts {
      experts {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
  expertsPage: `
    query ExpertsPage($request: PageRequest!) {
      expertsPage(request: $request) {
        ...paginatedResultFields
      }
    }
    ${paginatedResultFields}
  `,
  expertsPhase: `
    query ExpertsPhase($phase: String!) {
      expertsPhase(phase: $phase) {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
  expertsStartup: `
    query ExpertsStartup($startup: String!) {
      expertsStartup(startup: $startup) {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
  expertByAccount: `
    query ExpertsAccount($accountId: String!) {
      expertsAccount(accountId: $accountId) {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
  expertsDownload: `
    query ExpertsDownload($request: PageRequest!, $configId: String!, $format: TableExportFormats!) {
      expertsDownload(request: $request, configId: $configId, format: $format) {
        ...downloadResultFields
      }
    }
    ${downloadResultFields}
  `,
};

const mutation = {
  updateExpert: `
    mutation UpdateExpert($updateExpertInput: UpdateExpertInput!) {
      updateExpert(updateExpertInput: $updateExpertInput) {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
  deleteExperts: `
    mutation DeleteExperts($ids: [String!]!) {
      deleteExperts(ids: $ids) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkToPhase: `
    mutation LinkPhaseToExperts($experts: [String!]!, $name: String!, $phaseId: String!) {
      linkPhaseToExperts(experts: $experts, name: $name, phaseId: $phaseId) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
  linkStartups: `
    mutation LinkStartupsToExperts($expertId: String!, $phase: String!, $startUps: [StartupItem!]) {
      linkStartupsToExperts(expertId: $expertId, phase: $phase, startUps: $startUps) {
        ...expertFields
      }
    }
    ${fragments.expertFields}
  `,
};

export const expertQueries = {
  query,
  mutation,
};

export default expertQueries;
