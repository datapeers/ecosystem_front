import { FieldFilter } from "@shared/models/requests/field-order";
import { LogicOperator, parseOperator } from "@shared/models/requests/logic-operator.enum";
import { parseMatchMode } from "@shared/models/requests/match-mode.enum";
import { PageRequest } from "@shared/models/requests/page-request";
import { FilterMetadata, LazyLoadEvent } from "primeng/api";

const tableColumnToProperty = (tableColumn: string, replacement: string = '.') => {
  return tableColumn.split('; ').join(replacement).split(', ').join('.');
}

const parseTableOptionsToRequest = (
  lazyLoadEvent: LazyLoadEvent,
  globalFilterKeys: string[],
  invalidKeys: string[] = [],
  foreignFields: string[] = []
): PageRequest => {
  const filters: FieldFilter[] = [];
  const foreignfilters: FieldFilter[] = [];

  let globalOption: any = lazyLoadEvent?.filters['global'];
  let globalFilter: FieldFilter;
  if (globalOption?.value != null) {
    globalFilter = {
      operator: LogicOperator.Or,
      operations: globalFilterKeys.map((col) => {
        return {
          field: tableColumnToProperty(col),
          matchMode: globalOption.matchMode,
          value: globalOption.value,
        };
      }),
    };
  }

  Object.keys(lazyLoadEvent?.filters).forEach((filterKey) => {
    if (invalidKeys.includes(filterKey)) {
      return;
    }
    if (filterKey == 'global') {
      return;
    }
    const arrFilters: FilterMetadata[] = (
      lazyLoadEvent.filters[filterKey] as any[]
    ).filter((f) => f.value != null);
    if (arrFilters.length == 0) {
      return;
    } else {
      const field = tableColumnToProperty(filterKey);
      const nextFilter = {
        operator: parseOperator(arrFilters[0].operator),
        operations: arrFilters.map((af) => {
          return { field, value: af.value, matchMode: parseMatchMode(af.matchMode) };
        }),
      };
      if (foreignFields.some((field) => filterKey.includes(field))) {
        foreignfilters.push(nextFilter);
      } else {
        filters.push(nextFilter);
      }
    }
  });
  const sorts = [];
  const foreignSorts = [];
  if (lazyLoadEvent.sortField) {
    const nextSort = {
      field: tableColumnToProperty(lazyLoadEvent.sortField),
      order: lazyLoadEvent.sortOrder,
    };
    if (
      foreignFields.some((field) => lazyLoadEvent.sortField.includes(field))
    ) {
      foreignSorts.push(nextSort);
    } else {
      sorts.push(nextSort);
    }
  }

  const request = {
    globalFilter: globalFilter,
    skip: lazyLoadEvent.first,
    limit: lazyLoadEvent.rows,
    sort: sorts,
    filter: filters,
    foreignSort: foreignSorts,
    foreignFilter: foreignfilters,
  };
  return request;
}

export const requestUtilities = {
  parseTableOptionsToRequest
}