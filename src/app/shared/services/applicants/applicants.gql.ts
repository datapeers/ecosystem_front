import { updateResultPayloadFields } from '@shared/models/graphql/update-result-payload';

const fragments = {
  applicantFields: `
    fragment applicantFields on Applicant {
      _id
      item
      documentsFields
      state {
        notes
        documents {
          name
          url
          key
        }
        type
      }
      states {
        notes
        type
      }
      batch
    }
  `,
};

const query = {
  applicants: `
    query Applicants($announcement: String!, $state: ApplicationStates!) {
      applicants(announcement: $announcement, state: $state) {
        ...applicantFields
      }
    }
    ${fragments.applicantFields}
  `,
  applicant: `
    query Applicant($id: String!, $state: ApplicationStates!) {
      applicant(id: $id, state: $state) {
        ...applicantFields
      }
    }
    ${fragments.applicantFields}
  `,
};

const mutation = {
  updateApplicantState: `
    mutation UpdateApplicantState($updateApplicantStateInput: UpdateApplicantStateInput!) {
      updateApplicantState(updateApplicantStateInput: $updateApplicantStateInput) {
        ...applicantFields
      }
    }
    ${fragments.applicantFields}
  `,
  selectApplicantState: `
    mutation SelectApplicantState($idApplicant: String!, $idBatch: String!, $metadata: JSON!, $nameBatch: String!, $typeApplicant: AnnouncementTargets!) {
      selectApplicantState(idApplicant: $idApplicant, idBatch: $idBatch, metadata: $metadata, nameBatch: $nameBatch, typeApplicant: $typeApplicant) {
        ...applicantFields
      }
    }
    ${fragments.applicantFields}
  `,
};

export const applicantQueries = {
  query,
  mutation,
};

export default applicantQueries;
