import { Component } from '@angular/core';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { StartupsService } from '@shared/services/startups/startups.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-startup-select-table',
  templateUrl: './startup-select-table.component.html',
  styleUrls: ['./startup-select-table.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: StartupsService }
  ]
})
export class StartupSelectTableComponent {
  formCollection: FormCollections = FormCollections.startups;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  tableLocator: string = tableLocators.startups;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private readonly formService: FormService,
  ) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.tableTitle = "Startups";
    this.loading = true;
    const forms = await this.formService.getFormByCollection(this.formCollection);
    if(!forms.length) { return; }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: this.tableTitle,
      form: this.entityForm._id,
    }
    this.loading = false;
  }
}
