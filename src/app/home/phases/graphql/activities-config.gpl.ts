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
      experts {
        id
        limit
        activityID
      }
      teamCoaches {
        id
        limit
        activityID
      }
      startups {
        id
        limit
        activityID
      }
      createdAt
      updatedAt
      calcHours
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
