import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { BehaviorSubject, Subject, debounceTime, filter, first, firstValueFrom, lastValueFrom, skip, take, takeUntil, combineLatest } from 'rxjs';
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
import { requestUtilities } from '@shared/utils/request.utils';
import { PageRequest } from '@shared/models/requests/page-request';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent {
  @Input() set context(value: TableContext) {
    this.onContextChange.next(value);
  };
  get context(): TableContext {
    return this.onContextChange.getValue();
  }
  onContextChange = new BehaviorSubject<TableContext>(null);
  @Input() options: TableOptions;
  entity: DynamicTable;
  configs: TableConfig[];
  config: TableConfig;

  // Observables
  onDestroy$: Subject<void> = new Subject();
  onConfigChange = new Subject<TableConfig>();
  refresh$: Subject<void> = new Subject();
  clearCache$: Subject<void> = new Subject();

  @Input() locator: string;
  data: any;
  rawData: any;
  @Output() configChange: EventEmitter<TableConfig> = new EventEmitter();
  @Input() loading: boolean = false;
  @Input() title: string = '';
  @Output() onRowClick = new EventEmitter<any>();

  @Output() action = new EventEmitter<TableActionEvent>();
  @Input() disableActions: any;
  @Output() selection = new EventEmitter<any[]>();
  //Table config
  tabIndex: number = 0;

  //Lazy loading
  @Input() lazy: boolean = false;
  @Input() totalRecords: number = 0;
  @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() onLazyDownload = new EventEmitter<TableLazyDownloadEvent>();
  onPageRequest$: BehaviorSubject<PageRequest> = new BehaviorSubject(null);

  lazyLoadDebouncer: Subject<LazyLoadEvent> = new Subject<LazyLoadEvent>();

  @Input() downloading = false;
  selected: { _id: string }[] = [];
  textSummary = ``;
  page: number = 0;
  globalFilter = [];
  scrollHeight;
  rowInteract;
  rowMenuItems: MenuItem[] = [];
  lastLazyEvent: TableLazyLoadEvent = null;

  @ViewChild('dt', { static: true }) dt: Table;
  @ViewChild('tableWrapper', { static: false })
  wrapper: ElementRef<HTMLDivElement>;
  header: Element;
  footer: Element;

  @Input() allowFullscreen: boolean = true;
  fullscreen: boolean;

  actionsMenu: TableAction[] = [];
  featuredActions: TableAction[] = [];

  constructor(
    public dialogService: DialogService,
    private readonly service: DynamicTableService,
    private readonly documentProvider: DocumentProvider
  ) {
    // Table Config
    this.onConfigChange.pipe(
      filter((config) => config !== null && config !== undefined),
      takeUntil(this.onDestroy$)
    ).subscribe((newConfig) => this.handleConfigChange(newConfig));
  
    // Lazy loading
    this.lazyLoadDebouncer
    .pipe(
      debounceTime(400),
      takeUntil(this.onDestroy$)
    ).subscribe(lazyLoadEvent => this.handleLazyLoadChange(lazyLoadEvent));

    // Set as lazy if the provider can handle lazy loading
    this.lazy = !!this.documentProvider.getDocumentsPage;
    
    // Action callbacks
    this.setupCallbacks();
  }

  setupCallbacks() {
    this.clearCache$.pipe(takeUntil(this.onDestroy$)).subscribe(async () => {
      if(this.documentProvider.clearCache) { this.documentProvider.clearCache(); }
    });

    this.refresh$.pipe(takeUntil(this.onDestroy$)).subscribe(async () => {
      this.onConfigChange.next(this.config);
    });
  }

  handleLazyLoadChange(lazyLoadEvent: LazyLoadEvent) {
    this.lastLazyEvent = cloneDeep(lazyLoadEvent);
    Object.freeze(this.lastLazyEvent);
    this.onLazyLoad.emit(this.lastLazyEvent);
    this.setupTable();
  }

  async handleConfigChange(newConfig: TableConfig) {
    this.config = newConfig;
    const { loadEvent } = newConfig;
    if (newConfig?.loadEvent) {
      const { filters, sortField, sortOrder } = loadEvent;
      this.dt.filters = filters ? cloneDeep(filters) : {};
      this.dt.sortField = sortField ?? '';
      this.dt.sortOrder = sortOrder;
      if(this.lazy) {
        this.lazyLoadDebouncer.next(this.dt.createLazyLoadMetadata());
      }
    } else {
      // Reset filters trigger a new lazy load event
      this.resetFilters();
    }
    if(!this.lazy) {
      // If lazy load is not enabled the config change should be enough to setup the table again.
      this.setupTable();
    }
  }

  async setupTable() {
    await this.buildTable();
    this.loading = true;
    this.setOptions();
    this.setGlobalFilter();
    this.validateHeight();
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
    availableHeight -= this.header ? this.header.scrollHeight : 0;
    availableHeight -= this.footer ? this.footer.scrollHeight : 0;
    const tabViewHeight = 50;
    const finalHeight = availableHeight - tabViewHeight;
    const minHeight = 300;
    const height = Math.max(finalHeight, minHeight);
    this.scrollHeight = `${height}px`;
  }

  ngOnInit(): void {
    this.onContextChange.pipe(
      takeUntil(this.onDestroy$),
      filter(context => context != null)
    ).subscribe((_) => {
      this.initComponent();
    });
  }

  ngAfterViewInit() {
    const table: ElementRef<HTMLDivElement> = this.dt.el;
    this.header = table.nativeElement
      .getElementsByClassName('p-datatable-header')
      .item(0);
    this.footer = table.nativeElement
      .getElementsByClassName('p-paginator')
      .item(0);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async initComponent() {
    await this.initConfiguration();
  }

  async buildTable() {
    if(this.lazy) {
      const lazyEvent = this.lastLazyEvent ?? this.dt.createLazyLoadMetadata();
      const invalidKeys = ["_id"];
      const globalFilterKeys = this.config.columns
      .filter((c) => !invalidKeys.some((invalidKey) => invalidKey == c.key))
      .map((c) => c.key);
      const pageRequest = requestUtilities.parseTableOptionsToRequest(lazyEvent, globalFilterKeys);
      this.onPageRequest$.next(pageRequest);
      const pageResult = await this.documentProvider.getDocumentsPage(this.context.data, pageRequest);
      this.rawData = pageResult.documents;
      this.totalRecords = pageResult.totalRecords;
    } else {
      this.rawData = await this.documentProvider.getDocuments(this.context.data);
    }
    this.setRows(this.config.columns, this.rawData);
  }

  async initConfiguration() {
    const tableChanges = this.service.getTable(this.context.locator);
    tableChanges.pipe(
      // Cancel subscription if parent subscription emits a value
      // Skip(1) because subscription has initial value
      takeUntil(this.onContextChange.pipe(skip(1))),
      takeUntil(this.onDestroy$),
    ).subscribe(async entity => {
      this.entity = entity;
      if (!this.entity) {
        this.entity = await this.service.createTable(
          this.context.locator,
          this.context.form
        );
      }
      this.service
        .getTableConfigs(this.entity._id)
        .pipe(
          // Cancel subscription if parent subscription emits a value
          // Skip(1) because subscription has initial value
          takeUntil(tableChanges.pipe(skip(1))),
          takeUntil(this.onDestroy$),
        )
        .subscribe((configs) => {
          this.configs = cloneDeep(configs);
          const defaultConfig = this.configs[0];
          this.onConfigChange.next(defaultConfig);
        });
    });
  }

  includeCommand(action: TableAction, actionHandler): TableAction {
    const items: TableAction[] =
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
      (action: any) => (evt: { item: any; originalEvent: PointerEvent }) => {
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
    this.actionsMenu = mappedActions.filter((action: any) => !action.featured);
    this.featuredActions = mappedActions.filter(
      (action: any) => action.featured
    );
    if (this.options.showConfigButton) {
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

    if(this.documentProvider.deleteDocuments) {
      const noRowsSelected = () => !this.selected.length;
      this.actionsMenu.push({
        action: "delete",
        label: 'Eliminar registros',
        icon: 'pi pi-trash',
        disabled: noRowsSelected(),
        disableOn: noRowsSelected,
        command: async () => {
          const selectedDocumentsIds = this.selected.map(doc => doc._id);
          const result = await this.documentProvider.deleteDocuments(selectedDocumentsIds);
          if(result.acknowledged) {
            this.clearCache$.next();
            this.refresh$.next();
          }
        },
      });
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

  async callAction(action, element?: any | any[], event?: any) {
    const selected = Array.isArray(element) && element;
    const lastPageRequest = await firstValueFrom(this.onPageRequest$);
    this.action.emit({
      action,
      element,
      selected,
      event,
      lazyLoadEvent: this.lastLazyEvent,
      pageRequest: lastPageRequest,
      rawDataTable: this.rawData,
      callbacks: {
        refresh: () => {
          this.refresh$.next();
        },
        clearCache: () => {
          this.clearCache$.next();
        },
        fullRefresh: () => {
          this.clearCache$.next();
          this.refresh$.next();
        },
      },
    });
  }

  setRows(columns: TableColumns, rawData: any[]) {
    this.loading = true;
    this.data = rawData.map((doc) => {
      return tableUtilities.setRowList(doc, columns);
    });
    this.data = [...this.data];
    this.loading = false;
  }

  exportData(format: TableExportFormats) {
    //TODO: Handle export
  }

  onSelectAll(event: { originalEvent: PointerEvent; checked: boolean }) {
    this.updateActions();
  }

  onRowSelected(evt: any) {
    this.updateActions();
  }

  onRowUnselected(evt: any) {
    this.updateActions();
  }

  updateActions() {
    this.selection.emit(this.dt.selection);
    this.actionsMenu = this.actionsMenu.map(action => {
      if(action.disableOn) {
        return {
          ...action,
          disabled: action.disableOn()
        };
      }
      return action;
    });
  }

  columnReorder(_) {
    this.saveConfigChanges(this.config._id, {
      columns: this.config.columns,
    });
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
    if (!configName) return;
    await this.service.createTableConfig(this.entity._id, configName);
  }

  async deleteTableConfig(configId: string) {
    if (!configId) return;
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
        options: this.options,
      },
      showHeader: true,
    });
    ref.onClose
      .pipe(take(1), takeUntil(this.onDestroy$))
      .subscribe(async (config: ITableConfig) => {
        if (config) {
          this.saveConfigChanges(this.config._id, config);
        }
      });
  }

  async saveConfigChanges(configId: string, changes: Partial<ITableConfig>) {
    const updatedConfig = await this.service.updateTableConfig(
      this.entity._id,
      configId,
      changes
    );
    this.onConfigChange.next(updatedConfig);
  }
}
