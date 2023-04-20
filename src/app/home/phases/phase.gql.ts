const fragments = {
  phaseFields: `
  fragment phaseFields on Phase {
      _id
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
    }
  `,
};

const query = {
  getPhases: `
    query Phases() {
      phases() {
        ...phaseFields
      }
    }
    ${fragments.phaseFields}
  `,
};

const mutation = {
  createPhase: `
    ${fragments.phaseFields}
    mutation CreatePhase($createPhaseInput: createPhaseInput) {
      CreatePhase(createPhaseInput: $createPhaseInput) {
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
