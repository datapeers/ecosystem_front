import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import {
  TableColumn,
  TableColumnType,
  TableConfig,
} from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableFilters } from '@shared/components/dynamic-table/models/table-filters';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { TableSelection } from '@shared/components/dynamic-table/models/table-selection';
import { EntrepreneurSelectTableComponent } from '@shared/components/dynamic-table/table-select-dialog/providers/entrepreneur-select-table/entrepreneur-select-table.component';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-startups',
  templateUrl: './startups.component.html',
  styleUrls: ['./startups.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: StartupsService }],
})
export class StartupsComponent {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.startups;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();
  user: User;
  defaultFilters: TableFilters;
  filterProspects;
  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private readonly formService: FormService,
    private readonly dialogService: DialogService,
    private readonly service: StartupsService,
    private readonly route: ActivatedRoute
  ) {
    this.route.queryParamMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        this.filterProspects = !!params.get('prospects');
        const extraColumnsTable: TableColumn[] = [
          {
            label: 'Fases',
            key: 'phases; name',
            type: TableColumnType.data,
            format: 'string',
          },
        ];
        if (!this.filterProspects) {
          this.tableLocator = tableLocators.startups;
          this.defaultFilters = {
            isProspect: [
              { matchMode: 'equals', operator: 'and', value: false },
            ],
          };
        } else {
          this.tableLocator = tableLocators.startupsProspects;
          this.defaultFilters = {
            isProspect: [{ matchMode: 'equals', operator: 'and', value: true }],
          };
        }
        this.optionsTable = {
          save: true,
          download: false,
          details: true,
          summary: 'Startups',
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
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.optionsTable.summary = 'Startups';
    this.tableTitle = 'Startups';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);
    const entrepreneursForms = await this.formService.getFormByCollection(
      FormCollections.entrepreneurs
    );
    const entrepreneursForm = entrepreneursForms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: 'Startups',
      form: this.entityForm._id,
      joins: [
        {
          name: 'Empresarios',
          key: 'entrepreneurs',
          form: entrepreneursForm._id,
          extraColumns: [
            {
              label: 'Rol',
              key: 'rol',
              type: TableColumnType.data,
              format: 'string',
            },
          ],
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
    if (this.user.allowed(Permission.create_startups) && this.filterProspects)
      this.optionsTable.actionsTable.push({
        action: 'add',
        label: `Nueva Startup`,
        icon: 'pi pi-plus',
        featured: true,
      });
    if (this.user.allowed(Permission.edit_startups))
      this.optionsTable.actionsTable.push({
        action: 'linkWithEntrepreneurs',
        label: `Vincular a empresarios`,
        icon: 'pi pi-user',
      });
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
    pageRequest,
  }: TableActionEvent) {
    switch (action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: 'Create startup',
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Creación de startup'
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.fullRefresh();
          }
        });
        break;
      case 'linkWithEntrepreneurs':
        if (element.length === 0) {
          this.toast.alert({
            summary: 'No ha seleccionado ninguna startup',
            detail: '',
          });
          return;
        }
        this.dialogService
          .open(EntrepreneurSelectTableComponent, {
            modal: true,
            height: '100%',
            width: '100%',
          })
          .onClose.pipe(take(1), takeUntil(this.onDestroy$))
          .subscribe(async (data?: TableSelection) => {
            if (!data) return;
            if (!data.selected) return;
            const entrepreneursIds = data.selected;
            if (entrepreneursIds.length) {
              await this.service.linkWithEntrepreneurs(
                element.map((i) => i._id),
                entrepreneursIds
              );
              callbacks.fullRefresh();
            }
          });
        break;
    }
  }
}
