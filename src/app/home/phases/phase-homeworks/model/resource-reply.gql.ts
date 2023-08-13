const fragments = {
  resourceReplyFields: `
    fragment resourceReplyFields on ResourcesReply {
      _id
      item
      startup {
        _id
        item
      }
      type
      state
      observations
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
