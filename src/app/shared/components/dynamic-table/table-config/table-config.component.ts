import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ITableConfig, TableColumns, TableConfig } from '../models/table-config';
import { DynamicTable } from '../models/dynamic-table';
import { TableContext } from '../models/table-context';

@Component({
  selector: 'app-table-config',
  templateUrl: './table-config.component.html',
  styleUrls: ['./table-config.component.scss']
})
export class TableConfigComponent {
  table: DynamicTable;
  tableConfig: TableConfig;
  context: TableContext;
  loading = true;
  saving = false;
  fieldGroups: { name: string; type?: string; path?: string; columns: TableColumns; }[]; 

  selected: Record<string, boolean> = {};
  _selectedColumns: TableColumns = [];
  get selectedColumns() {
    return this._selectedColumns;
  }
  set selectedColumns(value: TableColumns) {
    this._selectedColumns = value;
    this.selected = value
      .map((col) => col.key)
      .reduce((dict, key) => {
        dict[key] = true;
        return dict;
      }, {});
  }

  get availableKeys() {
    return this.fieldGroups
      .map((g) => g.columns.map((c) => c.key))
      .reduce((accum, arr) => {
        arr.map((e) => {
          accum[e] = true;
        });
        return accum;
      }, {});
  }

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    const { table, tableConfig, context } = this.config.data;
    this.table = table;
    this.tableConfig = tableConfig;
    this.context = context;
  }

  ngOnInit(): void {
    this.initComponent();
  }

  async initComponent() {
    this.loading = true;
    const defaultGroup = {
      name: this.context.name,
      columns: this.table.columns,
    };
    this.fieldGroups = [defaultGroup];
    this.selectedColumns = [...this.tableConfig.columns];
    this.loading = false;
  }

  async saveChanges() {
    const updatedConfig: ITableConfig = {
      _id: this.tableConfig._id,
      name: this.tableConfig.name,
      columns: this.selectedColumns,
    }
    this.ref.close(updatedConfig);
  }

  addColumns(columns: any[]) {
    this.removeColumns(columns);
    this.selectedColumns = this.selectedColumns.concat(columns);
  }

  removeColumns(columns: any[]) {
    const columnsKeys = columns.map((c) => c.key);
    this.selectedColumns = this.selectedColumns.filter(
      (c) => !columnsKeys.includes(c.key)
    );
  }

  toggleColumn(column) {
    if (!this.selectedColumns.some((c) => c.key === column.key)) {
      this.selectedColumns = this.selectedColumns.concat([column]);
    } else {
      this.removeColumns([column]);
    }
  }
}