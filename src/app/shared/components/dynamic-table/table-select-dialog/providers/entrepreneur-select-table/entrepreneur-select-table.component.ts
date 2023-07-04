import { Component } from '@angular/core';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { EntrepreneursService } from '@shared/services/entrepreneurs/entrepreneurs.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-entrepreneur-select-table',
  templateUrl: './entrepreneur-select-table.component.html',
  styleUrls: ['./entrepreneur-select-table.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: EntrepreneursService }
  ]
})
export class EntrepreneurSelectTableComponent {
  formCollection: FormCollections = FormCollections.entrepreneurs;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  tableLocator: string = tableLocators.entrepreneurs;
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
    this.tableTitle = "Empresarios";
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
