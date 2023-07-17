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
import { InvestorsService } from '@shared/services/investors/investors.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: InvestorsService }],
})
export class InvestorsComponent {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.investors;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();

  constructor(private readonly formService: FormService) {
    this.optionsTable = {
      save: true,
      download: true,
      details: true,
      summary: 'Inversores',
      showConfigButton: true,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'add',
          label: `Nuevo Inversor`,
          icon: 'pi pi-plus',
          featured: true,
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
    this.optionsTable.summary = 'Inversores';
    this.tableTitle = 'Inversores';
    this.loading = true;
    // const forms = await this.formService.getFormByCollection(FormCollections.investors);
    // if(!forms.length) { return; }
    // this.entityForm = forms.find(() => true);
    // this.tableContext = {
    //   locator: this.tableLocator,
    //   name: "Inversores",
    //   form: this.entityForm._id,
    // }
    // this.loading = false;
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
          reason: 'Create investor',
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Creación de inversor'
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
