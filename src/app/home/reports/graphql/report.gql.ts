const fragments = {
  reportFields: `
  fragment reportFields on Report {
      _id
      name
      url
    }
  `,
};

const query = {
  report: `
    query Report($id: String!) {
      report(id: $id) {
        ...reportFields
      }
    }
    ${fragments.reportFields}
  `,
  reports: `
    query Reports {
      reports {
        ...reportFields
      }
    }
    ${fragments.reportFields}
  `,
};

const reportsQueries = {
  query,
};

export default reportsQueries;
