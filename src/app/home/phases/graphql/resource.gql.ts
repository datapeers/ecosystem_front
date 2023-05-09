const fragments = {
  resourceFields: `
  fragment resourceFields on Resource {
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
  `,
};

const query = {};

const mutation = {
  createResource: `
    ${fragments.resourceFields}
    mutation CreateResource($createResourceInput: CreateResourceInput!) {
      createResource(createResourceInput: $createResourceInput) {
        ...resourceFields
      }
    }
  `,
  updateResource: `
    ${fragments.resourceFields}
    mutation UpdateResource($updateResourceInput: UpdateResourceInput!) {
      updateResource(updateResourceInput: $updateResourceInput) {
        ...resourceFields
      }
    }
  `,
};

const resourceQueries = {
  query,
  mutation,
};

export default resourceQueries;
