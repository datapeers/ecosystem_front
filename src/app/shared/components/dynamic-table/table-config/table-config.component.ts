import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ITableConfig,
  TableColumns,
  TableConfig,
} from '../models/table-config';
import { DynamicTable } from '../models/dynamic-table';
import { TableContext } from '../models/table-context';
import { TableJoin } from '../models/table-join';
import { ColumnGroup } from '../models/column-group';
import { DynamicTableService } from '../dynamic-table.service';
import { Subject, takeUntil } from 'rxjs';
import { TableOptions } from '../models/table-options';

@Component({
  selector: 'app-table-config',
  templateUrl: './table-config.component.html',
  styleUrls: ['./table-config.component.scss'],
})
export class TableConfigComponent {
  table: DynamicTable;
  tableConfig: TableConfig;
  context: TableContext;
  options: TableOptions;
  joins: TableJoin[];
  loading = true;
  saving = false;
  columnGroups: ColumnGroup[];
  config$: Subject<DynamicDialogConfig> = new Subject();
  onDestroy$: Subject<void> = new Subject();

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
    return this.columnGroups
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
    private readonly dynamicTableService: DynamicTableService
  ) {
    this.config$.pipe(takeUntil(this.onDestroy$)).subscribe((config) => {
      const { table, tableConfig, context, options } = config.data;
      this.table = table;
      this.tableConfig = tableConfig;
      this.context = context;
      this.options = options;
      const availableJoins =
        this.context?.joins?.filter(
          (join) => !table.joins.some((tableJoin) => tableJoin.key === join.key)
        ) ?? [];
      this.joins = availableJoins;
      const defaultGroup = {
        name: this.context.name,
        columns: this.table.columns,
      };
      const tableColumnGroups = this.table?.columnGroups ?? [];
      const tableExtraColumns = this.options.extraColumnsTable;
      const extraColumnsGroup: ColumnGroup = {
        name: 'Columnas Adicionales',
        columns: tableExtraColumns,
      };
      this.columnGroups = [defaultGroup];
      if (extraColumnsGroup.columns.length) {
        this.columnGroups.push(extraColumnsGroup);
      }
      this.columnGroups.push(...tableColumnGroups);
      console.log(this.columnGroups);
      this.selectedColumns = [...this.tableConfig.columns];
    });
    this.config$.next(this.config);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async addJoin(join: TableJoin) {
    const updatedTable = await this.dynamicTableService.addTableJoin(
      this.table._id,
      join,
      this.context.locator
    );
    this.config$.next({
      ...this.config,
      data: {
        ...this.config.data,
        table: updatedTable,
      },
    });
  }

  async removeJoin(group: ColumnGroup) {
    const updatedTable = await this.dynamicTableService.removeTableJoin(
      this.table._id,
      group.key,
      this.context.locator
    );
    this.config$.next({
      ...this.config,
      data: {
        ...this.config.data,
        table: updatedTable,
      },
    });
  }

  async saveChanges() {
    const updatedConfig: ITableConfig = {
      _id: this.tableConfig._id,
      name: this.tableConfig.name,
      columns: this.selectedColumns,
    };
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
