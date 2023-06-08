import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, filter, fromEvent, take, takeUntil } from 'rxjs';
import { DynamicTableService } from './dynamic-table.service';
import { TableExportFormats } from './models/table-export-formats.enum';
import { TableAction, TableActionEvent } from './models/table-action';
import { TableOptions } from './models/table-options';
import { ITableConfig, TableColumns, TableConfig } from './models/table-config';
import { TableLazyDownloadEvent, TableLazyLoadEvent } from './models/lazy-load';
import { DynamicTable } from './models/dynamic-table';
import { DocumentProvider } from './models/document-provider';
import { tableUtilities } from './dynamic-table.utilities';
import { cloneDeep } from 'lodash';
import { TableConfigComponent } from './table-config/table-config.component';
import { TableContext } from './models/table-context';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent {
  @Input() context: TableContext;
  @Input() options: TableOptions;
  entity: DynamicTable;
  configs: TableConfig[];
  config: TableConfig;

  // Observables
  onDestroy$: Subject<void> = new Subject();
  onConfigChange = new Subject<TableConfig>();
  refresh$: Subject<void> = new Subject();

  @Input() locator: string;
  data: any;
  rawData: any;
  cols: any[] = [];
  @Output() configChange: EventEmitter<TableConfig> = new EventEmitter();
  @Input() loading: boolean = false;
  @Input() title: string = '';
  @Output() onRowClick = new EventEmitter<any>();

  @Output() action = new EventEmitter<TableActionEvent>();
  @Input() disableActions: any;
  //Table config
  tabIndex: number = 0;

  //Lazy loading
  @Input() lazy: boolean = false;
  @Input() totalRecords: number = 0;
  @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() onLazyDownload = new EventEmitter<TableLazyDownloadEvent>();

  lazyLoadDebouncer: Subject<LazyLoadEvent> = new Subject<LazyLoadEvent>();

  @Input() downloading = false;
  selected = [];
  textSummary = ``;
  page: number = 0;
  globalFilter = [];
  scrollHeight;
  rowInteract;
  rowMenuItems: MenuItem[] = [];
  lastLazyEvent: TableLazyLoadEvent = null;

  @ViewChild('dt', { static: true }) dt: Table;
  @ViewChild('tableWrapper', { static: false }) wrapper: ElementRef<HTMLDivElement>;
  header: Element;
  footer: Element;

  @Input() allowFullscreen: boolean = true;
  fullscreen: boolean;

  actionsMenu: any[] = [];
  featuredActions: any[] = [];

  constructor(
    public dialogService: DialogService,
    private readonly service: DynamicTableService,
    private readonly documentProvider: DocumentProvider,
  ) {
    this.onConfigChange.pipe(
      filter((config) => config !== null && config !== undefined),
      takeUntil(this.onDestroy$)
    )
    .subscribe((newConfig) => this.handleConfigChange(newConfig));

    this.refresh$.pipe(
      takeUntil(this.onDestroy$)
    )
    .subscribe(async () => {
      this.onConfigChange.next(this.config);
    });
  }

  handleConfigChange(newConfig: TableConfig) {
    this.buildTable();
    this.loading = true;
    const { columns, loadEvent } = newConfig;
    this.config = newConfig;
    this.cols = columns;
    if (newConfig?.loadEvent) {
      const { filters, sortField, sortOrder } = loadEvent;
      this.dt.filters = filters
        ? cloneDeep(filters)
        : {};
      this.dt.sortField = sortField ?? '';
      this.dt.sortOrder = sortOrder;
    } else {
      this.resetFilters();
    }
    this.loading = false;
  }

  @HostListener('window:fullscreenchange', ['$event'])
  screenChange(event) {
    if (!document.fullscreenElement) {
      this.fullscreen = false;
    }
    this.validateHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (!document.fullscreenElement && this.fullscreen) {
      this.fullscreen = false;
    }
    this.validateHeight();
  }

  validateHeight() {
    let availableHeight: number;
    availableHeight = this.wrapper.nativeElement.offsetHeight;
    availableHeight-= this.header ? this.header.scrollHeight : 0;
    availableHeight-= this.footer ? this.footer.scrollHeight : 0;
    const tabViewHeight = 50;
    const finalHeight = availableHeight - tabViewHeight;
    const minHeight = 300;
    const height = Math.max(finalHeight, minHeight);
    this.scrollHeight = `${height}px`;
  }

  ngOnInit(): void {
    this.initComponent();
  }

  ngAfterViewInit() {
    const table: ElementRef<HTMLDivElement> = this.dt.el;
    this.header = table.nativeElement.getElementsByClassName("p-datatable-header").item(0);
    this.footer = table.nativeElement.getElementsByClassName("p-paginator").item(0);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async initComponent() {
    await this.initConfiguration();
    await this.buildTable();
    this.setOptions();
    this.setGlobalFilter();
    this.validateHeight();
  }

  async buildTable() {
    this.rawData = await this.documentProvider.getDocuments(this.context.data);
    this.setRows(this.entity.columns);
  }

  async initConfiguration() {

    this.entity = await this.service.getTable(this.context.locator);
    if(!this.entity) {
      this.entity = await this.service.createTable(this.context.locator, this.context.form);
    }
    this.service.getTableConfigs(this.entity._id)
      .pipe(
        takeUntil(this.onDestroy$)
      ).subscribe((configs) => {
        this.configs = cloneDeep(configs);
        const defaultConfig = this.configs[0];
        this.onConfigChange.next(defaultConfig);
      });
  }

  includeCommand(action: TableAction, actionHandler): MenuItem | TableAction {
    const items: MenuItem[] =
      action?.items?.map((child) =>
        this.includeCommand(child, actionHandler)
      ) ?? undefined;
    const command = action.action ? actionHandler(action) : undefined;
    return {
      ...action,
      command,
      items,
      styleClass: action.class,
    };
  }

  initActionButtons() {
    const actionHandler =
    (action: any) =>
    (evt: { item: any; originalEvent: PointerEvent }) => {
      if (evt.item.type == 'input') {
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = evt.item.accept;
        fileInput.addEventListener('change', (fileEvent) => {
          this.callAction(action.action, this.selected, fileEvent);
          fileInput.remove();
        });
        fileInput.click();
      } else {
        this.callAction(action.action, this.selected, evt.originalEvent);
      }
    };
    const mappedActions = this.options.actionsTable.map((action) =>
      this.includeCommand(action, actionHandler)
    );
    this.actionsMenu = mappedActions.filter(
      (action: any) => !action.featured
    );
    this.featuredActions = mappedActions.filter(
      (action: any) => action.featured
    );
    if(this.options.showConfigButton) {
      this.featuredActions.push({
        label: 'Configurar tabla',
        icon: 'pi pi-cog',
        command: () => {
          this.openConfigDialog();
        },
      });
    }
    if (this.options.download) {
      this.actionsMenu.push({
        label: 'Descargar',
        icon: 'pi pi-download',
        items: [
          {
            label: 'xlsx',
            icon: 'pi pi-file-excel',
            command: () => {
              this.exportData(TableExportFormats.xlsx);
            },
          },
          {
            label: 'csv',
            icon: 'pi pi-file',
            command: () => {
              this.exportData(TableExportFormats.csv);
            },
          },
        ],
      });
    }
    if (this.options.showConfigButton) {
      if (this.featuredActions.length == 0) {
        this.featuredActions.push({
          label: 'Configurar tabla',
          icon: 'pi pi-cog',
          command: () => {
            this.openConfigDialog();
          },
        });
      } else {
        this.actionsMenu.push({
          label: 'Configurar tabla',
          icon: 'pi pi-cog',
          command: () => {
            this.openConfigDialog();
          },
        });
      }
      this.featuredActions.push({
        label: '',
        tooltip: 'Guardar filtros',
        icon: 'pi pi-filter',
        command: () => {
          this.saveCurrentFilters();
        },
      });
      const filterAction = {
        label: 'Filtros y orden',
        icon: 'pi pi-filter',
        items: [
          {
            label: 'Guardar',
            icon: 'pi pi-save',
            command: () => {
              this.saveCurrentFilters();
            },
          },
          {
            label: 'Limpiar',
            icon: 'pi pi-filter-slash',
            command: () => {
              this.resetFilters();
            },
          },
        ],
      };
      this.actionsMenu.push(filterAction);
    }
  }

  saveCurrentFilters() {
    const event = {
      filters: this.dt.filters,
      sortField: this.dt.sortField,
      sortOrder: this.dt.sortOrder,
    };
    let loadEvent: TableLazyLoadEvent = {
      filters: event.filters ?? undefined,
      sortField: event.sortField ?? undefined,
      sortOrder: event.sortOrder ?? undefined,
    };
    this.saveConfigChanges(this.config._id, { loadEvent });
  }

  setSummary() {
    this.textSummary = `Mostrando {first} a {last} de {totalRecords}`;
  }

  setOptions() {
    for (const key in this.options) {
      if (Object.prototype.hasOwnProperty.call(this.options, key)) {
        this.options[key] = this.options[key];
      }
    }
    this.initActionButtons();
    this.setSummary();
    this.rowMenuItems = [];
    this.rowMenuItems = this.options.actionsPerRow.map((i) => {
      return {
        label: i.label,
        icon: i.icon,
        styleClass: i.class,
        command: (event: { originalEvent: Event; item: any }) => {
          this.callAction(i.action, this.rowInteract, event.originalEvent);
        },
      };
    });
  }

  resetFilters() {
    if (this.dt) {
      this.dt.filters = {};
      this.dt.sortField = '';
      this.dt.sortOrder = 1;
      this.dt.reset();
    }
  }

  setGlobalFilter() {
    this.globalFilter = [];
  }

  callAction(action, element?: any, event?: any) {
    this.action.emit({
      action,
      element,
      event,
      callbacks: {
        refresh: () => { this.refresh$.next(); }
      }
    });
  }

  setRows(columns: TableColumns) {
    this.loading = true;
    this.data = this.rawData.map((doc) => {
      return tableUtilities.setRowList(doc, columns);
    });
    this.data = [...this.data];
    this.loading = false;
  }

  exportData(format: TableExportFormats) {
    //TODO: Handle export
  }

  onSelectAll(event: { originalEvent: PointerEvent; checked: boolean }) {
    //TODO: Find a way to make header selectall checkbox work with lazy loading
  }

  columnReorder(_) {
    this.saveConfigChanges(
      this.config._id,
      {
        columns: this.config.columns
      }
    );
  }

  clearFullscreen(): boolean {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.fullscreen = false;
      return true;
    }
    return false;
  }

  setFullscreen() {
    if (!this.clearFullscreen()) {
      document.body
        .requestFullscreen()
        .then(() => {
          this.fullscreen = true;
        })
        .catch((reason) => {
          this.fullscreen = false;
          console.error(reason);
        });
    }
  }

  async createNewConfigForTable(configName: string) {
    if(!configName) return;
    await this.service.createTableConfig(this.entity._id, configName);
  }

  async deleteTableConfig(configId: string) {
    if(!configId) return;
    await this.service.deleteTableConfig(this.entity._id, configId);
  }

  openConfigDialog() {
    const ref = this.dialogService.open(TableConfigComponent, {
      header: 'Configuración',
      modal: false,
      width: '100vw',
      height: '100vh',
      //Required for drag and drop to work properly on primeng components inside dialogs
      autoZIndex: false,
      baseZIndex: 999,
      data: {
        table: this.entity,
        tableConfig: this.config,
        context: this.context,
      },
      showHeader: true,
    });
    ref.onClose
      .pipe(
        take(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe(async (config: ITableConfig) => {
        if (config) {
          this.saveConfigChanges(this.config._id, config);
        }
      });
  }
  
  async saveConfigChanges(configId: string, changes: Partial<ITableConfig>) {
    const updatedConfig = await this.service.updateTableConfig(this.entity._id, configId, changes);
    this.onConfigChange.next(updatedConfig);
  }
}
