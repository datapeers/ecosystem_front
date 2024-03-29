const fragments = {
  phaseFields: `
  fragment phaseFields on Phase {
      _id
      stage
      name
      description
      thumbnail
      landing
      startAt
      endAt
      isActive
      published
      basePhase
      childrenOf
      createdAt
      updatedAt
      calcEndDate
    }
  `,
};

const query = {
  getPhase: `
    query Phase($id: String!) {
      phase(id: $id) {
        ...phaseFields
      }
    }
    ${fragments.phaseFields}
  `,
  getPhases: `
    query Phases {
      phases {
        ...phaseFields
      }
    }
    ${fragments.phaseFields}
  `,
  phasesList: `
    query PhasesList($ids: [String!]!) {
      phasesList(ids: $ids) {
        ...phaseFields
      }
    }
    ${fragments.phaseFields}
  `,
};

const mutation = {
  createPhase: `
    ${fragments.phaseFields}
    mutation CreatePhase($createPhaseInput: CreatePhaseInput!) {
      createPhase(createPhaseInput: $createPhaseInput) {
        ...phaseFields
      }
    }
  `,
  updatePhase: `
    ${fragments.phaseFields}
    mutation UpdatePhase($updatePhaseInput: UpdatePhaseInput!) {
      updatePhase(updatePhaseInput: $updatePhaseInput) {
        ...phaseFields
      }
    }
  `,
};

const phaseQueries = {
  query,
  mutation,
};

export default phaseQueries;
