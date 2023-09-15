const fragments = {
  configurationAppFields: `
    fragment configurationAppFields on ConfigurationApp {
        _id
        benefactors
        contentOfInterest
        dashboard
        services
    }
  `,
};

const query = {
  configurationApp: `
    query ConfigurationApp {
      configurationApp {
        ...configurationAppFields
      }
    }
    ${fragments.configurationAppFields}
  `,
};

const mutation = {
  updateConfigurationApp: `
    ${fragments.configurationAppFields}
    mutation UpdateConfigurationApp($updateConfigurationAppInput: UpdateConfigurationAppInput!) {
      updateConfigurationApp(updateConfigurationAppInput: $updateConfigurationAppInput) {
        ...configurationAppFields
      }
    }
  `,
};

const configurationAppQueries = {
  query,
  mutation,
};

export default configurationAppQueries;
