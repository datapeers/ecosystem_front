const fragments = {
  formFields: `
    fragment formFields on Form {
      _id
      name
      description
      formJson
      target
      documents
      keys
      tags {
        _id
        name
        createdAt
        updatedAt
      }
    }
  `,
  formSubscriptionFields: `
    fragment formSubscriptionFields on FormSubscription {
      _id
      doc
      form {
        ...formFields
      }
      opened
      data
      reason
      target
      createdAt
      updatedAt
    }
  `,
};

const query = {
  form: `
    query GetForm($id: String!){
      form(id: $id) {
        ...formFields
      }
    }
    ${fragments.formFields}
  `,
  forms: `
    query GetForms($target: FormCollections) {
      forms(target: $target) {
        ...formFields
      }
    }
    ${fragments.formFields}
  `,
};

const mutation = {
  createForm: `
    mutation CreateForm($createFormInput: CreateFormInput!) {
      createForm(createFormInput: $createFormInput) {
        ...formFields
      }
    }
    ${fragments.formFields}
  `,
  cloneForm: `
    mutation CloneForm($id: String!) {
      cloneForm(id: $id) {
        ...formFields
      }
    }
    ${fragments.formFields}
  `,
  updateForm: `
    mutation UpdateForm($updateFormInput: UpdateFormInput!) {
      updateForm(updateFormInput: $updateFormInput) {
        ...formFields
      }
    }
    ${fragments.formFields}
  `,
  deleteForm: `
    mutation DeleteForm($id: String!) {
      deleteForm(id: $id) {
        ...formFields
      }
    }
    ${fragments.formFields}
  `,
  createFormSubscription: `
    mutation CreateFormSubscription($createFormSubscriptionInput: CreateFormSubscriptionInput!) {
      createFormSubscription(createFormSubscriptionInput: $createFormSubscriptionInput) {
        ...formSubscriptionFields
      }
    }
    ${fragments.formSubscriptionFields}
    ${fragments.formFields}
  `,
  closeFormSubscription: `
  mutation CloseFormSubscription($id: String!) {
    closeFormSubscription(id: $id) {
      ...formSubscriptionFields
    }
  }
  ${fragments.formSubscriptionFields}
  ${fragments.formFields}
  `,  
};

const subscription = {
  listenFormSubscription: `
    subscription ListenFormSubscription($id: String!) {
      listenFormSubscription(id: $id) {
        ...formSubscriptionFields
      }
    }
    ${fragments.formSubscriptionFields}
    ${fragments.formFields}
  `,
};

const formQueries = {
  query,
  mutation,
  subscription,
}

export default formQueries;