import { updateResultPayloadFields } from "@shared/models/graphql/update-result-payload";

const fragments = {
  tableFields: `
    fragment tableFields on Table {
      _id
      locator
      form
      columns
    }
  `,
  tableConfigFields: `
    fragment tableConfigFields on TableConfig {
      _id
      name
      columns
      loadEvent
    }
  `,
};

const query = {
  getTable: `
    query GetTable($locator: String!) {
      table(locator: $locator) {
        ...tableFields
      }
    }
    ${fragments.tableFields}
  `,
  getTableConfig: `
    query GetTableConfig($id: String!) {
      tableConfig(id: $id) {
        ...tableConfigFields
      }
    }
    ${fragments.tableConfigFields}
  `,
  getTableConfigs: `
    query GetTableConfigs($table: String!) {
      tableConfigs(table: $table) {
        ...tableConfigFields
      }
    }
    ${fragments.tableConfigFields}
  `,
};

const mutation = {
  createTable: `
    mutation CreateTable($createTableInput: CreateTableInput!) {
      createTable(createTableInput: $createTableInput) {
        ...tableFields
      }
    }
    ${fragments.tableFields}
  `,
  updateTable: `
    mutation UpdateTable($updateTableInput: UpdateTableInput!) {
      updateTable(updateTableInput: $updateTableInput) {
        ...tableFields
      }
    }
    ${fragments.tableFields}
  `,
  createTableConfig: `
    mutation CreateTableConfig($createTableConfigInput: CreateTableConfigInput!) {
      createTableConfig(createTableConfigInput: $createTableConfigInput) {
        ...tableConfigFields
      }
    }
    ${fragments.tableConfigFields}
  `,
  updateTableConfig: `
    mutation UpdateTableConfig($updateTableConfigInput: UpdateTableConfigInput!) {
      updateTableConfig(updateTableConfigInput: $updateTableConfigInput) {
        ...tableConfigFields
      }
    }
    ${fragments.tableConfigFields}
  `,
  deleteTableConfig: `
    mutation DeleteTableConfig($id: String!) {
      deleteTableConfig(id: $id) {
        ...updateResultPayloadFields
      }
    }
    ${updateResultPayloadFields}
  `,
};

const tableQueries = {
  query,
  mutation,
}

export default tableQueries;