const fragments = {
  configurationAppFields: `
    fragment configurationAppFields on ConfigurationApp {
        _id
        benefactors
        contentOfInterest
        dashboard
        verticals
        services
        createdAt
        updatedAt
    }
  `,
  configurationAppFieldsExtra: `
    fragment configurationAppFieldsExtra on ConfigurationApp {
        _id
        benefactors
        contentOfInterest
        dashboard
        verticals
        services
        createdAt
        updatedAt
        initGraph
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
  configurationAppExtends: `
    query ConfigurationApp {
      configurationApp {
        ...configurationAppFieldsExtra
      }
    }
    ${fragments.configurationAppFieldsExtra}
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
