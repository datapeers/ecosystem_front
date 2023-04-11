const fragments = {
  invitationFields: `
    fragment invitationFields on Invitation {
      _id
      rol
      createdBy {
        fullName
      }
      createdAt
      updatedAt
      expiresAt
      state
      email
    }
  `
}

const query = {
  invitations: `
    query Invitations($skip: Int, $limit: Int) {
      invitations(skip: $skip, limit: $limit) {
        ...invitationFields
      }
    }
    ${fragments.invitationFields}
  `,
};

const mutation = {
  createInvitation: `
    mutation CreateInvitation($email: String!, $rol: ValidRoles!) {
      createInvitation(email: $email, rol: $rol) {
        ...invitationFields
      }
    }
    ${fragments.invitationFields}
  `,
  cancelInvitation: `
    mutation CancelInvitation($id: String!) {
      cancelInvitation(id: $id) {
        ...invitationFields
      }
    }
    ${fragments.invitationFields}
  `,
};

export const invitationQueries = {
  query,
  mutation
};

export default invitationQueries;