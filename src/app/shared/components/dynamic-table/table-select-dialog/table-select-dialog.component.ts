import { Component, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormCollections } from '@shared/form/enums/form-collections';
import { AppForm } from '@shared/form/models/form';
import { Subject } from 'rxjs';
import { FormService } from '@shared/form/form.service';
import { TableActionEvent } from '../models/table-action';
import { TableContext } from '../models/table-context';
import { TableOptions } from '../models/table-options';
import { PageRequest } from '@shared/models/requests/page-request';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-table-select-dialog',
  templateUrl: './table-select-dialog.component.html',
  styleUrls: ['./table-select-dialog.component.scss']
})
export class TableSelectDialogComponent {
  selection: any[] = [];
  optionsTable: TableOptions;
  @Input() formCollection: FormCollections;
  @Input() tableContext: TableContext;
  loading: boolean = false;
  @Input() tableTitle: string = 'Registros';
  @Input() tableLocator: string;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private formService: FormService,
  ) {
    const noRowsSelected = () => !this.selection.length;
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: this.tableTitle,
      showConfigButton: false,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'select',
          icon: 'pi pi-check',
          label: 'Confirmar',
          featured: true,
          disabled: noRowsSelected(),
          disableOn: noRowsSelected,
        },
        {
          action: 'close',
          icon: 'pi pi-times',
          label: 'Cerrar',
          featured: true,
          class: "p-button-outlined",
        }
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
    this.optionsTable.summary = "Emprendedores";
    this.tableTitle = "Emprendedores";
    this.loading = true;
    const forms = await this.formService.getFormByCollection(this.formCollection);
    if(!forms.length) { return; }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: "Emprendedores",
      form: this.entityForm._id,
    }
    this.loading = false;
  }

  async actionFromTable({ action, element, selected, event, callbacks, pageRequest }: TableActionEvent) {
    switch(action) {
      case 'select':
        this.applySelection(selected, pageRequest);
        break;
      case 'close':
        this.close();
        break;
    }
  }
  
  applySelection(selectedRows: any[], pageRequest: PageRequest) {
    const selected = selectedRows.map(row => row._id);
    const outputData = { selected, pageRequest };
    this.ref.close(outputData);
  }

  close() {
    this.ref.close();
  }
}
