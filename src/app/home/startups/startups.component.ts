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
import { StartupsService } from '@shared/services/startups/startups.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-startups',
  templateUrl: './startups.component.html',
  styleUrls: ['./startups.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: StartupsService }
  ]
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

  constructor(
    private readonly formService: FormService,
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: "Startups",
      showConfigButton: true,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'add',
          label: `Nueva Startup`,
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
    this.optionsTable.summary = "Startups";
    this.tableTitle = "Startups";
    this.loading = true;
    const forms = await this.formService.getFormByCollection(FormCollections.startups);
    if(!forms.length) { return; }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: "Startups",
      form: this.entityForm._id,
    }
    this.loading = false;
  }

  async actionFromTable({ action, element, event, callbacks }: TableActionEvent) {
    switch(action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: "Create startup",
        });
        const ref = this.formService.openFormFromSubscription(subscription, "Creación de startup");
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
