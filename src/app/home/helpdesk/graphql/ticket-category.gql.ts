const fragments = {
  ticketCategoryFields: `
  fragment ticketCategoryFields on TicketCategory {
      _id      
      name
      color
      isDeleted
      createdAt
      updatedAt
    }
  `,
};

const query = {
  ticketCategories: `
        query Categories {
          categories {
            ...ticketCategoryFields
          }
        }
        ${fragments.ticketCategoryFields}
    `,
};

const mutation = {
  createTicketCategory: `
        ${fragments.ticketCategoryFields}
        mutation CreateCategory($createTicketCategoryInput: CreateCategoryInput!) {
          createCategory(createTicketCategoryInput: $createTicketCategoryInput) {
            ...ticketCategoryFields
          }
        }
    `,
};

const ticketCategoryQueries = {
  query,
  mutation,
};

export default ticketCategoryQueries;
