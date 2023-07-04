import { Component } from '@angular/core';
import { tableLocators } from '../../../locators';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { BusinessesService } from '@shared/services/businesses/businesses.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { AppForm } from '@shared/form/models/form';
import { FormService } from '@shared/form/form.service';
import { Subject } from 'rxjs';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';

@Component({
  selector: 'app-business-select-table',
  templateUrl: './business-select-table.component.html',
  styleUrls: ['./business-select-table.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: BusinessesService }
  ]
})
export class BusinessSelectTableComponent {
  formCollection: FormCollections = FormCollections.businesses;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = 'Businesses';
  tableLocator: string = tableLocators.businesses;
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
    this.tableTitle = "Empresas";
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
