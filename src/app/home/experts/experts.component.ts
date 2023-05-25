import { Component } from '@angular/core';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { ExpertsService } from '@shared/services/experts/experts.service';
import { ToastService } from '@shared/services/toast.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-experts',
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: ExpertsService }
  ]
})
export class ExpertsComponent {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.experts;
  entityForm: AppForm;
  tableHeightOffset: number = 0;
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private readonly formService: FormService,
    private readonly toast: ToastService,
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: "Expertos",
      showConfigButton: true,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'add',
          label: `Nuevo Experto`,
          icon: 'pi pi-plus',
          featured: true
        },
      ],
    };
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.optionsTable.summary = "Expertos";
    this.tableTitle = "Expertos";
    this.loading = true;
    const forms = await this.formService.getFormByCollection(FormCollections.experts);
    if(!forms.length) { return; }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: "Expertos",
      form: this.entityForm._id,
    }
    this.loading = false;
  }

  async actionFromTable({ action, element, event, callbacks }: TableActionEvent) {
    switch(action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: "Create expert",
        });
        const ref = this.formService.openFormFromSubscription(subscription, "Creación de experto");
        ref.pipe(
          take(1),
          takeUntil(this.onDestroy$)
        ).subscribe((doc) => {
          if(doc) {
            callbacks.refresh();
          }
        });
        break;
    }
  }
}
