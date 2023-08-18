const fragments = {
  stageFields: `
  fragment stageFields on Stage {
      _id
      index
      name
      label
      color
      icon
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
  changeIndex: `
    ${fragments.stageFields}
    mutation UpdateStageIndex($newIndex: Int!, $stageId: String!, $typeChange: String!) {
      updateStageIndex(newIndex: $newIndex, stageId: $stageId, typeChange: $typeChange) {
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
