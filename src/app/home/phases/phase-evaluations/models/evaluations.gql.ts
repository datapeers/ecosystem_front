const fragments = {
  evaluationFields: `
    fragment evaluationFields on Evaluation {
      _id
      evaluatedName
      config
      createdAt
      evaluated
      form
      config
      isDeleted
      item
      reviewer
      state
      updatedAt
    }
  `,
};

const query = {
  getEvaluation: `
    query Evaluation($id: String!) {
      evaluation(id: $id) {
        ...evaluationFields
      }
    }
    ${fragments.evaluationFields}
  `,
  getEvaluations: `
    query Evaluations {
      evaluations {
        ...evaluationFields
      }
    }
    ${fragments.evaluationFields}
  `,
  getEvaluationsByConfig: `
    query EvaluationsByConfig($config: String!) {
      evaluationsByConfig(config: $config) {
        ...evaluationFields
      }
    }
    ${fragments.evaluationFields}
  `,
};

const mutation = {
  createEvaluation: `
    ${fragments.evaluationFields}
    mutation CreateEvaluation($createEvaluationInput: CreateEvaluationInput!) {
      createEvaluation(createEvaluationInput: $createEvaluationInput) {
        ...evaluationFields
      }
    }
  `,
  updateEvaluation: `
    ${fragments.evaluationFields}
    mutation UpdateEvaluation($updateEvaluationInput: UpdateEvaluationInput!) {
      updateEvaluation(updateEvaluationInput: $updateEvaluationInput) {
        ...evaluationFields
      }
    }
  `,
  deleteEvaluation: `
  ${fragments.evaluationFields}
    mutation RemoveEvaluation($id: String!) {
      removeEvaluation(id: $id) {
        ...evaluationFields
      } 
    }
`,
};

const evaluationsQueries = {
  query,
  mutation,
};

export default evaluationsQueries;
