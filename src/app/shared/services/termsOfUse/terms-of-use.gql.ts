const fragments = {
  termsOfUseFields: `
    fragment termsOfUseFields on TermsOfUse {
        _id
        name
        content
        extra_options
        createdAt
        updatedAt
    }
  `,
};

const query = {
  termsOfUseByName: `
    query TermsOfUseByName($name: String!) {
      termsOfUseByName(name: $name) {
        ...termsOfUseFields
      }
    }
    ${fragments.termsOfUseFields}
  `,
};

const mutation = {
  updateTermsOfUse: `
    mutation UpdateTermsOfUse($updateTermsOfUseInput: UpdateTermsOfUseInput!) {
      updateTermsOfUse(updateTermsOfUseInput: $updateTermsOfUseInput) {
        ...termsOfUseFields
      }
    }
    ${fragments.termsOfUseFields}
  `,
};

export const termsOfUseQueries = {
  query,
  mutation,
};

export default termsOfUseQueries;
