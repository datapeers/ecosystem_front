const fragments = {
  rolFields: `
  fragment rolFields on Rol {
      _id
      name
      type
      permissions
    }
  `,
};

const query = {
  getRol: `
    query Rol($id: String!) {
      rol(id: $id) {
        ...rolFields
      }
    }
    ${fragments.rolFields}
  `,
  getRoles: `
    query Roles {
      roles {
        ...rolFields
      }
    }
    ${fragments.rolFields}
  `,
};

const mutation = {
  createRol: `
    ${fragments.rolFields}
    mutation CreateRol($createRolInput: CreateRolInput!) {
      createRol(createRolInput: $createRolInput) {
        ...rolFields
      }
    }
  `,
  updateRol: `
    ${fragments.rolFields}
    mutation UpdateRol($updateRolInput: UpdateRolInput!) {
      updateRol(updateRolInput: $updateRolInput) {
        ...rolFields
      }
    }
  `,
  deleteRol: `
  ${fragments.rolFields}
    mutation RemoveRol($id: String!) {
      removeRol(id: $id) {
        ...rolFields
      } 
    }
`,
};

const rolQueries = {
  query,
  mutation,
};

export default rolQueries;
