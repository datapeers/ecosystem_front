import { Component } from '@angular/core';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import {
  TableColumnType,
  TableConfig,
} from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { TableSelection } from '@shared/components/dynamic-table/models/table-selection';
import { BusinessSelectTableComponent } from '@shared/components/dynamic-table/table-select-dialog/providers/business-select-table/business-select-table.component';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { EntrepreneursService } from '@shared/services/entrepreneurs/entrepreneurs.service';
import { DialogService } from 'primeng/dynamicdialog';
import { take, takeUntil, Subject, firstValueFrom, first } from 'rxjs';
import { StartupSelectTableComponent } from '@shared/components/dynamic-table/table-select-dialog/providers/startup-select-table/startup-select-table.component';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilters } from '@shared/components/dynamic-table/models/table-filters';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-entrepreneurs',
  templateUrl: './entrepreneurs.component.html',
  styleUrls: ['./entrepreneurs.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: EntrepreneursService }],
})
export class EntrepreneursComponent {
  optionsTable: TableOptions;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.entrepreneurs;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();
  user: User;
  defaultFilters: TableFilters = {};
  constructor(
    private store: Store<AppState>,
    private readonly formService: FormService,
    private readonly dialogService: DialogService,
    private readonly service: EntrepreneursService,
    private readonly route: ActivatedRoute,
    private toast: ToastService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        const filterProspects = !!params.get('prospects');
        const extraColumnsTable = [];
        if (!filterProspects) {
          this.tableLocator = tableLocators.entrepreneurs;
          this.defaultFilters = {};
        } else {
          this.tableLocator = tableLocators.entrepreneursProspects;
          this.defaultFilters = {
            isProspect: [
              { matchMode: 'equals', operator: 'and', value: false },
            ],
          };
        }
        this.optionsTable = {
          save: true,
          download: false,
          details: true,
          summary: 'Emprendedores',
          showConfigButton: true,
          redirect: null,
          selection: true,
          actions_row: 'compress',
          actionsPerRow: [],
          extraColumnsTable: extraColumnsTable,
          actionsTable: [],
        };
        this.loadComponent();
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.optionsTable.summary = 'Emprendedores';
    this.tableTitle = 'Emprendedores';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.entrepreneurs
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);
    const businessesForms = await this.formService.getFormByCollection(
      FormCollections.businesses
    );
    const businessesForm = businessesForms.find(() => true);
    const startupsForms = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    const startupsForm = startupsForms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: 'Emprendedores',
      form: this.entityForm._id,
      joins: [
        {
          name: 'Empresas',
          key: 'businesses',
          form: businessesForm._id,
          extraColumns: [],
        },
        {
          name: 'Startups',
          key: 'startups',
          form: startupsForm._id,
          extraColumns: [],
        },
      ],
      defaultFilters: this.defaultFilters,
    };
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    this.actionsTableOptions();
    this.loading = false;
  }

  actionsTableOptions() {
    if (this.user.allowed(Permission.create_entrepreneurs))
      this.optionsTable.actionsTable.push({
        action: 'add',
        label: `Nuevo Emprendedor`,
        icon: 'pi pi-plus',
        featured: true,
      });
    if (this.user.allowed(Permission.edit_entrepreneurs))
      this.optionsTable.actionsTable.push(
        {
          action: 'linkWithBusinesses',
          label: `Vincular a negocios`,
          icon: 'pi pi-building',
        },
        {
          action: 'linkWithStartups',
          label: `Vincular a startup`,
          icon: 'pi pi-bolt',
        }
      );
  }

  async actionFromTable({
    action,
    element,
    selected,
    event,
    callbacks,
    pageRequest,
  }: TableActionEvent) {
    const entrepreneurIds = selected.map((selected) => selected._id);
    switch (action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: 'Create entrepreneur',
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Creación de emprendedor'
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.fullRefresh();
          }
        });
        break;
      case 'linkWithBusinesses':
        this.dialogService
          .open(BusinessSelectTableComponent, {
            modal: true,
            height: '100%',
            width: '100%',
          })
          .onClose.pipe(take(1), takeUntil(this.onDestroy$))
          .subscribe(async (data?: TableSelection) => {
            if (!data) return;
            if (!data.selected) return;
            const businessesIds = data.selected;
            this.toast.info({
              summary: 'Guardando cambios',
              detail: 'Por favor espere',
              life: 12000000,
            });
            try {
              if (entrepreneurIds.length) {
                await this.service.linkWithBusinesses(
                  entrepreneurIds,
                  businessesIds
                );
              } else {
                await this.service.linkWithBusinessesByRequest(
                  pageRequest,
                  businessesIds
                );
              }
              this.toast.clear();
              this.toast.success({
                summary: 'Cambios guardados',
                detail: '',
              });
            } catch (error) {
              this.toast.clear();
              this.toast.error({
                summary: 'Error al intentar mezclar emprendedor y empresa',
                detail: error,
              });
            }

            callbacks.fullRefresh();
          });
        break;
      case 'linkWithStartups':
        this.dialogService
          .open(StartupSelectTableComponent, {
            modal: true,
            height: '100%',
            width: '100%',
          })
          .onClose.pipe(take(1), takeUntil(this.onDestroy$))
          .subscribe(async (data?: TableSelection) => {
            if (!data) return;
            if (!data.selected) return;
            const startupsIds = data.selected;
            if (startupsIds.length > 1) {
              this.toast.alert({
                summary:
                  'No se permite enlazar multiples emprendedores a una startup, no varias',
                detail: '',
                life: 12000,
              });
              return;
            }
            this.toast.info({
              summary: 'Guardando cambios',
              detail: 'Por favor espere',
              life: 12000000,
            });
            try {
              if (entrepreneurIds.length) {
                await this.service.linkWithStartups(
                  entrepreneurIds,
                  startupsIds
                );
              } else {
                await this.service.linkWithStartupsByRequest(
                  pageRequest,
                  startupsIds
                );
              }
              this.toast.clear();
              this.toast.info({ summary: 'Cambio realizado', detail: '' });
            } catch (error) {
              this.toast.clear();
              this.toast.error({
                summary: 'Error al intentar mezclar emprendedor y startup',
                detail: error,
              });
            }
            callbacks.fullRefresh();
          });
        break;
    }
  }
}
