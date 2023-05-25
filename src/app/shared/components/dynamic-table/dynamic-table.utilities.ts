// const buildConfigOptions = (
//   rows: any,
//   otherColumns: IColumn[],
//   hideID: boolean = false,
//   nameId: string = 'ID'
// ): RowConfigColumn[] => {
//   let displayColumnsTable: RowConfigColumn[] = [];
//   if (!hideID) {
//     displayColumnsTable.push(
//       new RowConfigColumn(`${nameId}`, 'data', '_id', 'string')
//     );
//   }
//   const initColumns = otherColumns
//     .filter((i) => i.position === 'start')
//     .map((column) => RowConfigColumn.fromColumn(column));
//   displayColumnsTable = [...initColumns];

//   if (rows.length != 0) {
//     const ignore = ['button', 'htmlelement', 'content'];
//     const itemsForm = rows.components.filter((i) => !ignore.includes(i.type));
//     for (const iterator of itemsForm) {
//       switch (iterator.type) {
//         case 'datagrid':
//           for (const iteratorComponent of iterator.components) {
//             const childGrid = set_column(
//               `${iterator.label}, ${iteratorComponent.label}`,
//               iterator.type,
//               `item, ${iterator.key}; ${iteratorComponent.key}`,
//               iteratorComponent
//             );
//             childGrid.type = 'array';
//             displayColumnsTable.push(childGrid);
//           }
//           break;

//         case 'panel':
//           for (const iteratorComponent of iterator.components) {
//             const childPanel = set_column(
//               iteratorComponent.label,
//               iteratorComponent.type,
//               `item, ${iteratorComponent.key}`,
//               iteratorComponent
//             );
//             displayColumnsTable.push(childPanel);
//           }
//           break;
//         case 'well':
//           for (const iteratorComponent of iterator.components) {
//             const childWell = set_column(
//               iteratorComponent.label,
//               iteratorComponent.type,
//               `item, ${iteratorComponent.key}`,
//               iteratorComponent
//             );
//             displayColumnsTable.push(childWell);
//           }
//           break;
//         default:
//           displayColumnsTable.push(
//             set_column(
//               iterator.label,
//               iterator.type,
//               `item, ${iterator.key}`,
//               iterator
//             )
//           );
//           break;
//       }
//     }
//   }
//   const extraColumns = otherColumns
//     .filter((i) => !i.position)
//     .map((column) => RowConfigColumn.fromColumn(column));
//   displayColumnsTable = displayColumnsTable.concat(extraColumns);

//   const lastColumns = otherColumns
//     .filter((i) => i.position === 'end')
//     .map((column) => RowConfigColumn.fromColumn(column));
//   displayColumnsTable = displayColumnsTable.concat(lastColumns);

//   return displayColumnsTable;
// }

// const setColsConfig = (columns: RowConfigColumn[]) => {
//   const columnsToSelect = [];
//   for (const iterator of columns) {
//     if (iterator.children.length === 0) {
//       columnsToSelect.push({
//         field: iterator.label,
//         header: iterator.label,
//         ...iterator,
//       });
//     }
//     for (const innerIterator of iterator.children) {
//       columnsToSelect.push({
//         field: innerIterator.label,
//         header: innerIterator.label,
//         ...innerIterator,
//       });
//     }
//   }
//   return columnsToSelect;
// }

// const set_column = (label: string, format: string, key: any, row?: any) => {
//   switch (format) {
//     case 'textfield':
//       if (row.widget && row.widget.type === 'calendar') {
//         return new RowConfigColumn(label, 'data', key, 'date');
//       }
//       return new RowConfigColumn(label, 'data', key, 'string');
//     case 'number':
//       return new RowConfigColumn(label, 'data', key, 'number');
//     case 'currency':
//       return new RowConfigColumn(label, 'data', key, 'currency');
//     case 'datetime':
//       return new RowConfigColumn(label, 'data', key, 'dateAndTime');
//     case 'time':
//       return new RowConfigColumn(label, 'data', key, 'time');
//     case 'checkbox':
//       return new RowConfigColumn(label, 'data', key, 'boolean');
//     case 'tags':
//       if (row.storeas) {
//         return new RowConfigColumn(label, 'data', key, 'arraysTags');
//       }
//       return new RowConfigColumn(label, 'data', key, 'string');
//     case 'selectboxes':
//       return new RowConfigColumn(label, 'select_boxes', key, 'string', {
//         children: [],
//         innerKeys: row.values.map((i) => {
//           return { key: i.value, label: i.label };
//         }),
//       });
//     case 'select':
//       let options;
//       if (row?.data?.values) {
//         options = row?.data?.values
//           ? row.data.values.map((val) => val.value)
//           : [];
//       }
//       if (row?.data?.json) {
//         options = row?.data?.json
//           ? row.data.json.map((val) => val?.value ?? val)
//           : [];
//       }
//       let itemSelect = new RowConfigColumn(label, 'data', key, 'string', {
//         options,
//       });
//       if (row.multiple) {
//         if (row.data.url !== '' && row.valueProperty === '') {
//           itemSelect = new RowConfigColumn(
//             `${label}, ${row.label}`,
//             'array',
//             `${key}; value`,
//             'string'
//           );
//         } else {
//           itemSelect = new RowConfigColumn(
//             `${label}, ${row.label}`,
//             'array',
//             `${key};`,
//             'string'
//           );
//         }
//       }
//       return itemSelect;
//     default:
//       return new RowConfigColumn(label, 'data', key, 'string');
//   }
// }

// const dotNotate = (obj, target = {}, prefix = '') => {
//   Object.keys(obj).map((key) => {
//     if (typeof obj[key] === 'object' && obj[key] !== null) {
//       dotNotate(obj[key], target, prefix + key + '.');
//     } else {
//       return (target[prefix + key] = obj[key]);
//     }
//   });
//   return target;
// };

// const setRowList = (
//   tableDocument: any,
//   config: IColumn[] = [],
//   options?: { classRow?: string }
// ) => {
//   let newRow = { _id: tableDocument._id, ...options };
//   const dotNotatedDocument = dotNotate(tableDocument);
//   config.forEach((columnConfig) => {
//     const { key, type } = columnConfig;
//     const dotNotatedKey = key.split('; ').join('.').split(', ').join('.');
//     const valuesPlaceholder = [];
//     Object.entries(dotNotatedDocument).map(([k, v]) => {
//       const fixedKey = k
//         .split('.')
//         .filter((kv) => isNaN(+kv))
//         .join('.');
//       if (fixedKey == dotNotatedKey) {
//         valuesPlaceholder.push(v);
//       }
//     });
//     if (key.includes(';') || type === 'array') {
//       newRow[key] = valuesPlaceholder;
//     } else {
//       newRow[key] = valuesPlaceholder.find((first) => first);
//     }
//   });
//   return newRow;
// }

// const removeBoundFromLazyLoadEvent = (
//   event: CustomLazyLoadEvent,
//   toRemove: string
// ): LazyLoadEvent => {
//   event.filters = Object.keys(event.filters).reduce((prev, curr) => {
//     if (curr.startsWith(toRemove)) {
//       prev[curr.substring(curr.indexOf(',') + 2)] = event.filters[curr];
//     } else {
//       prev[curr] = event.filters[curr];
//     }
//     return prev;
//   }, {});
//   if (event?.sortField?.startsWith(toRemove)) {
//     event.sortField = event.sortField.substring(
//       event.sortField.indexOf(',') + 2
//     );
//   }
//   if (event.unwrap) {
//     event.unwrap = event.unwrap.map((field) => {
//       if (field.startsWith(toRemove)) {
//         return field.substring(field.indexOf('.') + 1);
//       } else {
//         return field;
//       }
//     });
//   }
//   return event;
// }

// const parseTableOptionsToRequest = (
//   lazyLoadEvent: CustomLazyLoadEvent,
//   globalFilterKeys: string[],
//   invalidKeys: string[] = [],
//   foreignFields: string[] = []
// ): IPaginationRequest => {
//   const filters: IFieldFiltering[] = [];
//   const foreignfilters: IFieldFiltering[] = [];

//   let globalOption: any = lazyLoadEvent.filters['global'];
//   let globalFilter: IFieldFiltering;
//   if (globalOption?.value != null) {
//     globalFilter = {
//       operator: 'or',
//       operations: globalFilterKeys.map((col) => {
//         return {
//           field: tableColumnToProperty(col),
//           matchMode: globalOption.matchMode,
//           value: globalOption.value,
//         };
//       }),
//     };
//   }

//   Object.keys(lazyLoadEvent.filters).forEach((filterKey) => {
//     if (invalidKeys.includes(filterKey)) {
//       return;
//     }
//     if (filterKey == 'global') {
//       return;
//     }
//     const arrFilters: FilterMetadata[] = (
//       lazyLoadEvent.filters[filterKey] as any[]
//     ).filter((f) => f.value != null);
//     if (arrFilters.length == 0) {
//       return;
//     } else {
//       const field = tableColumnToProperty(filterKey);
//       const nextFilter = {
//         operator: arrFilters[0].operator,
//         operations: arrFilters.map((af) => {
//           return { field, value: af.value, matchMode: af.matchMode };
//         }),
//       };
//       if (foreignFields.some((field) => filterKey.includes(field))) {
//         foreignfilters.push(nextFilter);
//       } else {
//         filters.push(nextFilter);
//       }
//     }
//   });
//   const sorts = [];
//   const foreignSorts = [];
//   if (lazyLoadEvent.sortField) {
//     const nextSort = {
//       field: tableColumnToProperty(lazyLoadEvent.sortField),
//       order: lazyLoadEvent.sortOrder,
//     };
//     if (
//       foreignFields.some((field) => lazyLoadEvent.sortField.includes(field))
//     ) {
//       foreignSorts.push(nextSort);
//     } else {
//       sorts.push(nextSort);
//     }
//   }

//   const unwrapFields = lazyLoadEvent?.unwrap ?? [];
//   const request = {
//     globalFilter: globalFilter,
//     skip: lazyLoadEvent.first,
//     limit: lazyLoadEvent.rows,
//     sort: sorts,
//     filter: filters,
//     foreignSort: foreignSorts,
//     foreignFilter: foreignfilters,
//     unwrap: unwrapFields.filter(
//       (field) =>
//         !foreignFields.some((foreignField) => field.startsWith(foreignField))
//     ),
//     foreignUnwrap: unwrapFields.filter((field) =>
//       foreignFields.some((foreignField) => field.startsWith(foreignField))
//     ),
//   };
//   return request;
// }

// const tableColumnToProperty = (tableColumn: string, replacement: string = '.') => {
//   return tableColumn.split('; ').join(replacement).split(', ').join('.');
// }

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
  config: any[] = [],
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
    if (key.includes(';') || type === 'array') {
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