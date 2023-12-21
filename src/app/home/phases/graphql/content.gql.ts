const fragments = {
  contentFields: `
  fragment contentFields on Content {
      _id
      childs {
        _id
        resources {
          _id
          name
          hide
          isDeleted
          createdAt
          updatedAt
          type
          extra_options
        }
        extra_options
        name
        content
        hide
        phase
        isDeleted
        createdAt
        updatedAt
      }
      resources {
        _id
        name
        hide
         isDeleted
        createdAt
        updatedAt
        type
        extra_options
      }
      extra_options
      name
      content
      hide
      phase
      isDeleted
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getContent: `
    query Content($id: String!) {
      content(id: $id) {
        ...contentFields
      }
    }
    ${fragments.contentFields}
  `,
  getContents: `
    query Content($phase: String!) {
      allContent(phase: $phase) {
        ...contentFields
      }
    }
    ${fragments.contentFields}
  `,
  lastContent: `
    query LastContent($batchId: String!, $startupId: String!) {
      lastContent(batchId: $batchId, startupId: $startupId) {
        lastContent {
          ...contentFields
        }
        contentCompleted
        numberOfContent
        numberOfResourcesPending
      }
    }
    ${fragments.contentFields}
  `,
};

const mutation = {
  createContent: `
    ${fragments.contentFields}
    mutation CreateContent($createContentInput: CreateContentInput!) {
      createContent(createContentInput: $createContentInput) {
        ...contentFields
      }
    }
  `,
  updateContent: `
    ${fragments.contentFields}
    mutation UpdateContent($updateContentInput: UpdateContentInput!) {
      updateContent(updateContentInput: $updateContentInput) {
        ...contentFields
      }
    }
  `,
};

const contentQueries = {
  query,
  mutation,
};

export default contentQueries;
