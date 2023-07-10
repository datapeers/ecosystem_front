import { TableColumn, TableColumnType } from "./models/table-config";

const dotNotate = (obj, target = {}, prefix = '') => {
  Object.keys(obj).map((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      dotNotate(obj[key], target, prefix + key + '.');
    } else {
      return (target[prefix + key] = obj[key]);
    }
  });
  return target;
};

const setRowList = (
  tableDocument: any,
  config: TableColumn[] = [],
  options?: { classRow?: string }
) => {
  let newRow = { _id: tableDocument._id, ...options };
  const dotNotatedDocument = dotNotate(tableDocument);
  config.forEach((columnConfig) => {
    const { key, type } = columnConfig;
    const dotNotatedKey = key.split('; ').join('.').split(', ').join('.');
    const valuesPlaceholder = [];
    Object.entries(dotNotatedDocument).map(([k, v]) => {
      const fixedKey = k
        .split('.')
        .filter((kv) => isNaN(+kv))
        .join('.');
      if (fixedKey == dotNotatedKey) {
        valuesPlaceholder.push(v);
      }
    });
    if (key.includes(';') || type === TableColumnType.array) {
      newRow[key] = valuesPlaceholder;
    } else {
      newRow[key] = valuesPlaceholder.find((first) => first);
    }
  });
  return newRow;
}

export const tableUtilities = {
  setRowList
};