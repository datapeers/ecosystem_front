const fragments = {
  evaluationConfigFields: `
    fragment evaluationConfigFields on ConfigEvaluation {
        _id
        createdAt
        description
        endAt
        evaluated
        form
        isDeleted
        reviewer
        startAt
        title
        updatedAt
    }
  `,
};

const query = {
  getEvaluationConfig: `
    query ConfigEvaluation($id: String!) {
      configEvaluation(id: $id) {
        ...evaluationConfigFields
      }
    }
    ${fragments.evaluationConfigFields}
  `,
  getEvaluationConfigs: `
    query ConfigEvaluations {
      configEvaluations {
        ...evaluationConfigFields
      }
    }
    ${fragments.evaluationConfigFields}
  `,
  getEvaluationsByPhase: `
    query ConfigEvaluationsByPhase($phase: String!) {
      configEvaluationsByPhase(phase: $phase) {
        ...evaluationConfigFields
      }
    }
    ${fragments.evaluationConfigFields}
  `,
};

const mutation = {
  createConfigEvaluation: `
    ${fragments.evaluationConfigFields}
    mutation CreateConfigEvaluation($createConfigEvaluationInput: CreateConfigEvaluationInput!) {
      createConfigEvaluation(createConfigEvaluationInput: $createConfigEvaluationInput) {
        ...evaluationConfigFields
      }
    }
  `,
  updateEvaluation: `
    ${fragments.evaluationConfigFields}
    mutation UpdateConfigEvaluation($updateConfigEvaluationInput: UpdateConfigEvaluationInput!) {
      updateConfigEvaluation(updateConfigEvaluationInput: $updateConfigEvaluationInput) {
        ...evaluationConfigFields
      }
    }
  `,
  deleteEvaluation: `
  ${fragments.evaluationConfigFields}
    mutation RemoveConfigEvaluation($id: String!) {
      removeConfigEvaluation(id: $id) {
        ...evaluationConfigFields
      } 
    }
`,
};

const evaluationsConfigQueries = {
  query,
  mutation,
};

export default evaluationsConfigQueries;
