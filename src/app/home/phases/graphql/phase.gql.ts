const fragments = {
  phaseFields: `
  fragment phaseFields on Phase {
      _id
      index
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
      finished
      createdAt
      updatedAt
      calcEndDate
      participants
    }
  `,
  phaseFieldsExtra: `
  fragment phaseFieldsExtra on Phase {
      _id
      index
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
      finished
      calcEndDate
      stageDoc {
        _id
        index
        name
        description
        label
        color
        icon
        isDeleted
        createdAt
        updatedAt
      }
      participants
    }
  `,
};

const query = {
  getPhase: `
    query Phase($id: String!) {
      phase(id: $id) {
        ...phaseFieldsExtra
      }
    }
    ${fragments.phaseFieldsExtra}
  `,
  getPhases: `
    query Phases {
      phases {
        ...phaseFields
      }
    }
    ${fragments.phaseFields}
  `,
  phasesBases: `
    query PhasesBases {
      phasesBases {
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
  phasesListWithExtra: `
    query PhasesList($ids: [String!]!) {
      phasesList(ids: $ids) {
        ...phaseFieldsExtra
      }
    }
    ${fragments.phaseFieldsExtra}
  `,
  searchInBatchOutput: `
    query SearchInBatch($othersInput: SearchBatchInput!) {
      searchInBatch(OthersInput: $othersInput) {
        ansContent
        ansPhases
        ansResource
      }
    }
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
    ${fragments.phaseFieldsExtra}
    mutation UpdatePhase($updatePhaseInput: UpdatePhaseInput!) {
      updatePhase(updatePhaseInput: $updatePhaseInput) {
        ...phaseFieldsExtra
      }
    }
  `,
  removePhase: `
    ${fragments.phaseFields}
    mutation RemovePhase($removePhaseId: String!) {
      removePhase(id: $removePhaseId) {
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
