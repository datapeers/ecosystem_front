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
};

export const startupQueries = {
  query,
  mutation,
};

export default startupQueries;
