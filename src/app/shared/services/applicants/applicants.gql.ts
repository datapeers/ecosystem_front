const fragments = {
  applicantFields: `
    fragment applicantFields on Applicant {
      _id
      item
    }
  `
}

const query = {
  applicants: `
    query Applicants($announcement: String!) {
      applicants(announcement: $announcement) {
        ...applicantFields
      }
    }
    ${fragments.applicantFields}
  `,
};

const mutation = {

};

export const applicantQueries = {
  query,
  mutation
};

export default applicantQueries;