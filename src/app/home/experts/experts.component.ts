import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableFilters } from '@shared/components/dynamic-table/models/table-filters';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { ExpertsService } from '@shared/services/experts/experts.service';
import { ToastService } from '@shared/services/toast.service';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-experts',
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: ExpertsService }],
})
export class ExpertsComponent {
  optionsTable: TableOptions;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.experts;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();
  user: User;
  defaultFilters: TableFilters;
  filterProspects;
  constructor(
    private store: Store<AppState>,
    private readonly formService: FormService,
    private readonly toast: ToastService,
    private readonly route: ActivatedRoute
  ) {
    this.route.queryParamMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        this.filterProspects = !!params.get('prospects');
        const extraColumnsTable = [];
        if (!this.filterProspects) {
          this.tableLocator = tableLocators.experts;
          this.defaultFilters = {
            isProspect: [
              { matchMode: 'equals', operator: 'and', value: false },
            ],
          };
        } else {
          this.tableLocator = tableLocators.expertsProspects;
          this.defaultFilters = {
            isProspect: [{ matchMode: 'equals', operator: 'and', value: true }],
          };
        }
        this.optionsTable = {
          save: true,
          download: false,
          details: true,
          summary: 'Expertos',
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

  ngOnInit(): void {}

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.optionsTable.summary = 'Expertos';
    this.tableTitle = 'Expertos';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.experts
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: 'Expertos',
      form: this.entityForm._id,
      defaultFilters: this.defaultFilters,
    };
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    this.actionsTableOptions();
    this.loading = false;
  }

  actionsTableOptions() {
    if (this.user.allowed(Permission.create_experts) && this.filterProspects)
      this.optionsTable.actionsTable.push({
        action: 'add',
        label: `Nuevo Experto`,
        icon: 'pi pi-plus',
        featured: true,
      });
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
  }: TableActionEvent) {
    switch (action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: 'Create expert',
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Creación de experto'
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.fullRefresh();
          }
        });
        break;
    }
  }
}
