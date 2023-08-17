const fragments = {
  resourceReplyFields: `
    fragment resourceReplyFields on ResourcesReply {
      _id
      item
      startup {
        _id
        item
      }
      resource {
        _id
        name
        extra_options
        hide
        content
        phase
        type
        isDeleted
        createdAt
        updatedAt
      }
      type
      state
      observations
      modified
      createdAt
      updatedAt
      isDeleted
    }
  `,
};

const query = {
  getResourceRepliesByResource: `
    query ResourcesReplyByResource($resource: String!, $sprint: String!) {
      resourcesReplyByResource(resource: $resource, sprint: $sprint) {
        ...resourceReplyFields
      }
    }
    ${fragments.resourceReplyFields}
  `,
  getResourceRepliesByStartup: `
    query ResourcesReplyByStartup($startup: String!, $phase: String!) {
      resourcesReplyByStartup(startup: $startup, phase: $phase) {
        ...resourceReplyFields
      }
    }
    ${fragments.resourceReplyFields}
  `,
};

const mutation = {
  createResourceReply: `
    ${fragments.resourceReplyFields}
    mutation CreateResourcesReply($createResourcesReplyInput: CreateResourcesReplyInput!) {
      createResourcesReply(createResourcesReplyInput: $createResourcesReplyInput) {
        ...resourceReplyFields
      }
    }
  `,
  updateResourceReply: `
    ${fragments.resourceReplyFields}
    mutation UpdateResourcesReply($updateResourcesReplyInput: UpdateResourcesReplyInput!) {
      updateResourcesReply(updateResourcesReplyInput: $updateResourcesReplyInput) {
        ...resourceReplyFields
      }
    }
  `,
};

const resourceRepliesQueries = {
  query,
  mutation,
};

export default resourceRepliesQueries;
