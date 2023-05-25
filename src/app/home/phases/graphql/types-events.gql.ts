const fragments = {
  typesEventFields: `
  fragment typesEventFields on typesEvent {
      _id
      name
      allowActa
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
    mutation UpdateStage($updateTypesEventInput: UpdateTypesEventInput!) {
      updateTypesEvent(updateTypesEventInput: $updateTypesEventInput) {
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
