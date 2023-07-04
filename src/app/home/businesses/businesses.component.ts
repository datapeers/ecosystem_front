import { Component } from '@angular/core';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { TableSelection } from '@shared/components/dynamic-table/models/table-selection';
import { EntrepreneurSelectTableComponent } from '@shared/components/dynamic-table/table-select-dialog/providers/entrepreneur-select-table/entrepreneur-select-table.component';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { BusinessesService } from '@shared/services/businesses/businesses.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: BusinessesService }
  ]
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
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private readonly formService: FormService,
    private readonly dialogService: DialogService,
    private readonly service: BusinessesService,
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
        {
          action: 'linkWithEntrepreneurs',
          label: `Vincular a empresarios`,
          icon: 'pi pi-user',
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

  async actionFromTable({ action, element, event, callbacks, pageRequest }: TableActionEvent) {
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
            callbacks.fullRefresh();
          }
        });
        break;
      case 'linkWithStartups':
        this.dialogService.open(EntrepreneurSelectTableComponent, {
          modal: true,
          height: "100%",
          width: "100%",
        }).onClose
          .pipe(
            take(1),
            takeUntil(this.onDestroy$)
          ).subscribe(async (data?: TableSelection) => {
            if(!data) return;
            if(!data.selected) return;
            const entrepreneursIds = data.selected;
            if(entrepreneursIds.length) {
              await this.service.linkWithEntrepreneurs(entrepreneursIds, entrepreneursIds);
            } else {
              await this.service.linkWithEntrepreneursByRequest(pageRequest, entrepreneursIds);
            }
          });
        break;
    }
  }
}
