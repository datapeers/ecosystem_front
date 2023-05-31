const fragments = {
  typesEventFields: `
  fragment typesEventFields on TypesEvent {
      _id
      name
      extra_options
      isDeleted
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getType: `
    query TypeEvent($id: String!) {
      typesEvent(id: $id) {
        ...typesEventFields
      }
    }
    ${fragments.typesEventFields}
  `,
  getTypes: `
    query TypeEvents {
      typesEvents {
        ...typesEventFields
      }
    }
    ${fragments.typesEventFields}
  `,
};

const mutation = {
  createTypesEvent: `
    ${fragments.typesEventFields}
    mutation CreateTypeEvent($createTypesEventInput: CreateTypesEventInput!) {
      createTypesEvent(createTypesEventInput: $createTypesEventInput) {
        ...typesEventFields
      }
    }
  `,
  updateTypeEvent: `
    ${fragments.typesEventFields}
    mutation UpdateTypeEvent($updateTypesEventInput: UpdateTypesEventInput!) {
      updateTypesEvent(updateTypesEventInput: $updateTypesEventInput) {
        ...typesEventFields
      }
    }
  `,
  deleteTypeEvent: `
  ${fragments.typesEventFields}
  mutation RemoveTypeEvent($id: String!) {
    removeTypesEvent(id: $id) {
      ...typesEventFields
    }
  }
`,
};

const typesEventsQueries = {
  query,
  mutation,
};

export default typesEventsQueries;
