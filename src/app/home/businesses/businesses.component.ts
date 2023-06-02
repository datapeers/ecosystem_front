import { Component } from '@angular/core';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss']
})
export class BusinessesComponent {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.businesses;
  entityForm: AppForm;
  tableHeightOffset: number = 0;
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private readonly formService: FormService,
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: "Empresas",
      showConfigButton: true,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'add',
          label: `Nueva Empresa`,
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
    this.optionsTable.summary = "Empresas";
    this.tableTitle = "Empresas";
    this.loading = true;
    const forms = await this.formService.getFormByCollection(FormCollections.businesses);
    if(!forms.length) { return; }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: "Empresas",
      form: this.entityForm._id,
    }
    this.loading = false;
  }

  async actionFromTable({ action, element, event, callbacks }: TableActionEvent) {
    switch(action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: "Create business",
        });
        const ref = this.formService.openFormFromSubscription(subscription, "Creación de empresa");
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
