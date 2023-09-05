const fragments = {
  ticketFields: `
    fragment ticketFields on Ticket {
        _id
        title
        status
        childs: {
            body
            attachment
            isResposne
            answerBy
        }
        startupId
        startupName
        isDeleted
        createdAt
        updatedAt
    }
    `,
};

const query = {
  tickets: `
  query Query($filter: HelpDeskFilterInput!) {
        helpDeskTickets(filter: $filter) {
            childs: {
                body
                attachment
                isResposne
                answerBy
            }
            createdAt
            isDeleted
            startupId
            startupName
            status
            title
            updatedAt
          }
        }`,
  ticket: `
    query Query($helpDeskTicketId: ID!) {
        helpDeskTicket(id: $helpDeskTicketId) {
            childs: {
                body
                attachment
                isResposne
                answerBy
            }
            createdAt
            isDeleted
            startupId
            startupName
            status
            title
            updatedAt
          }
        }`,
};

const mutation = {};

const ticketQueries = {
  query,
  mutation,
};

export default ticketQueries;
