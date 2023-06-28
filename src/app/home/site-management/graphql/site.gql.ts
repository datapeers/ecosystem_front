const fragments = {
  siteFields: `
  fragment siteFields on Site {
      _id
      name
      thumbnail
      description
      coords
      isDeleted
      createdAt
      updatedAt
    }
  `,
};

const query = {
  getSite: `
    query Site($id: String!) {
      site(id: $id) {
        ...siteFields
      }
    }
    ${fragments.siteFields}
  `,
  getSites: `
    query Sites {
      sites {
        ...siteFields
      }
    }
    ${fragments.siteFields}
  `,
};

const mutation = {
  createSite: `
    ${fragments.siteFields}
    mutation CreateSite($createSiteInput: CreateSiteInput!) {
      createSite(createSiteInput: $createSiteInput) {
        ...siteFields
      }
    }
  `,
  updateSite: `
    ${fragments.siteFields}
    mutation UpdateSite($updateSiteInput: UpdateSiteInput!) {
      updateSite(updateSiteInput: $updateSiteInput) {
        ...siteFields
      }
    }
  `,
  deleteSite: `
  ${fragments.siteFields}
    mutation RemoveSite($id: String!) {
      removeSite(id: $id) {
        ...siteFields
      } 
    }
`,
};

const sitesQueries = {
  query,
  mutation,
};

export default sitesQueries;
