const fragments = {
  actaFields: `
  fragment actaFields on Acta {
      _id
      name
      objective
      solution
      event
      phase
      date
      topics_covered
      conclusions
      extra_options
      isDeleted
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getActa: `
    query Acta($id: String!) {
      event(id: $id) {
        ...actaFields
      }
    }
    ${fragments.actaFields}
  `,
  getActas: `
    query Actas {
      actas {
        ...actaFields
      }
    }
    ${fragments.actaFields}
  `,
  getActaEvent: `
    query ActaEvent($event: String!) {
      actaEvent(event: $event) {
        ...actaFields
      }
    }
    ${fragments.actaFields}
  `,
};

const mutation = {
  createActa: `
    ${fragments.actaFields}
    mutation CreateActa($createActaInput: CreateActaInput!) {
      createActa(createActaInput: $createActaInput) {
        ...actaFields
      }
    }
  `,
  updateActa: `
    ${fragments.actaFields}
    mutation UpdateActa($updateActaInput: UpdateActaInput!) {
      updateActa(updateActaInput: $updateActaInput) {
        ...actaFields
      }
    }
  `,
  deleteActa: `
  ${fragments.actaFields}
    mutation RemoveActa($id: String!) {
      removeActa(id: $id) {
        ...actaFields
      } 
    }
`,
};

const actasQueries = {
  query,
  mutation,
};

export default actasQueries;
