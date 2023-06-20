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
  expertsPhase: `
    query ExpertsPhase($phase: String!) {
      expertsPhase(phase: $phase) {
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
};

const mutation = {
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
