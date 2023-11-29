const fragments = {
  integrationFields: `
    fragment integrationFields on Integration {
        _id
        code
        typeIntegration
        createdAt
        updatedAt
    }
  `,
};

const query = {
  integrations: `
    query Integrations {
      integrations {
        ...integrationFields
      }
    }
    ${fragments.integrationFields}
  `,
};

const mutation = {
  createIntegration: `
   mutation CreateIntegration($createIntegrationInput: CreateIntegrationInput!) {
      createIntegration(createIntegrationInput: $createIntegrationInput) {
        ...integrationFields
      }
    }
    ${fragments.integrationFields}
  `,
};

export const integrationQueries = {
  query,
  mutation,
};

export default integrationQueries;
