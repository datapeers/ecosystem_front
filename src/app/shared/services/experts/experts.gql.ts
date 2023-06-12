import { updateResultPayloadFields } from '@shared/models/graphql/update-result-payload';

const fragments = {
  expertFields: `
    fragment expertFields on Expert {
      _id
      phases {
        _id
        name
      }
      item
    }
  `,
};

const query = {
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
};

export const expertQueries = {
  query,
  mutation,
};

export default expertQueries;
