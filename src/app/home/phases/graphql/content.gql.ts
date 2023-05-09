const fragments = {
  contentFields: `
  fragment contentFields on Content {
      _id
      childs {
        _id
        name
        content
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
        hide
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
