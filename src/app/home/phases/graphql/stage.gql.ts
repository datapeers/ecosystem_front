const fragments = {
  stageFields: `
  fragment stageFields on Stage {
      _id
      name
      label
      color
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getStage: `
    query Stage($id: String!) {
      stage(id: $id) {
        ...stageFields
      }
    }
    ${fragments.stageFields}
  `,
  getStages: `
    query Stages {
      stages {
        ...stageFields
      }
    }
    ${fragments.stageFields}
  `,
};

const mutation = {
  createStage: `
    ${fragments.stageFields}
    mutation CreateStage($createStageInput: CreateStageInput!) {
      createStage(createStageInput: $createStageInput) {
        ...stageFields
      }
    }
  `,
  updateStage: `
    ${fragments.stageFields}
    mutation UpdateStage($updateStageInput: UpdateStageInput!) {
      updateStage(updateStageInput: $updateStageInput) {
        ...stageFields
      }
    }
  `,
  deleteStage: `
  ${fragments.stageFields}
  mutation RemoveStage($id: String!) {
    removeStage(id: $id) {
      ...stageFields
    }
  }
  `,
};

const stageQueries = {
  query,
  mutation,
};

export default stageQueries;
