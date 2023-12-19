const fragments = {
  activitiesConfigFields: `
  fragment activitiesConfigFields on ActivitiesConfig {
      _id
      limit
      phase
      activities {
        id
        limit
      }
       startups {
        limit
        activityID
        entityID
      }
      experts {
        limit
        activityID
        entityID
      }
      teamCoaches {
        limit
        activityID
        entityID
      }
      createdAt
      updatedAt
      calcHours
    }
  `,
  activitiesPerStartupConfigFields: `
  fragment activitiesPerStartupConfigFields on Hours {      
      hours
    }
  `,
};

const query = {
  getConfig: `
    query ActivitiesConfig($phase: String!) {
      activitiesConfigPhase(phase: $phase) {
        ...activitiesConfigFields
      }
    }
    ${fragments.activitiesConfigFields}
  `,
  getConfigPerStartup: `
  query ActivitiesConfigPerStartup($phase: String!, $startup: String!) {
      activitiesConfigPhasePerStartup(phase: $phase, startup: $startup) {
        ...activitiesPerStartupConfigFields
      }
    }
    ${fragments.activitiesPerStartupConfigFields}
  `,
};

const mutation = {
  createActivitiesConfig: `
    ${fragments.activitiesConfigFields}
    mutation CreateActivitiesConfig($createActivitiesConfigInput: CreateActivitiesConfigInput!) {
      createActivitiesConfig(createActivitiesConfigInput: $createActivitiesConfigInput) {
        ...activitiesConfigFields
      }
    }
  `,
  updateActivitiesConfig: `
    ${fragments.activitiesConfigFields}
    mutation UpdateActivitiesConfig($updateActivitiesConfigInput: UpdateActivitiesConfigInput!) {
      updateActivitiesConfig(updateActivitiesConfigInput: $updateActivitiesConfigInput) {
        ...activitiesConfigFields
      }
    }
  `,
};

const activitiesConfigQueries = {
  query,
  mutation,
};

export default activitiesConfigQueries;
