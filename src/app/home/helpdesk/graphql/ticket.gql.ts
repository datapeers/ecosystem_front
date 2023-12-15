const fragments = {
  ticketFields: `
    fragment ticketFields on HelpDeskTicket {
      _id
      category
      childs
      createdAt
      isDeleted
      startupId
      startupName
      status
      title
      updatedAt
    }
  `,
};

const query = {
  helpDeskFiltered: `
    query HelpDeskFiltered($filters: JSON!) {
      helpDeskFiltered(filters: $filters) {
        ...ticketFields
      }
    }
    ${fragments.ticketFields}
  `,
};

const mutation = {
  createHelpDesk: `
    ${fragments.ticketFields}
    mutation CreateHelpDesk($createHelpDeskInput: CreateHelpDeskInput!) {
      createHelpDesk(createHelpDeskInput: $createHelpDeskInput) {
        ...ticketFields
      }
    }
  `,
  updateHelpDesk: `
    ${fragments.ticketFields}
    mutation UpdateHelpDesk($updateHelpDeskInput: UpdateHelpDeskInput!) {
      updateHelpDesk(updateHelpDeskInput: $updateHelpDeskInput) {
        ...ticketFields
      }
    }
  `,
  removeHelpDesk: `
    ${fragments.ticketFields}
    mutation RemoveHelpDesk($removeHelpDeskId: ID!) {
      removeHelpDesk(id: $removeHelpDeskId) {
        ...ticketFields
      }
    }
  `,
};

const ticketQueries = {
  query,
  mutation,
};

export default ticketQueries;
