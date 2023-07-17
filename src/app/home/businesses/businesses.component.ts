import { Component } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import {
  TableColumnType,
  TableConfig,
} from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { TableSelection } from '@shared/components/dynamic-table/models/table-selection';
import { EntrepreneurSelectTableComponent } from '@shared/components/dynamic-table/table-select-dialog/providers/entrepreneur-select-table/entrepreneur-select-table.component';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { BusinessesService } from '@shared/services/businesses/businesses.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: BusinessesService }],
})
export class BusinessesComponent {
  optionsTable: TableOptions;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string = tableLocators.businesses;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();
  user: User;
  constructor(
    private store: Store<AppState>,
    private readonly formService: FormService,
    private readonly dialogService: DialogService,
    private readonly service: BusinessesService
  ) {
    this.optionsTable = {
      save: true,
      download: true,
      details: true,
      summary: 'Empresas',
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
          featured: true,
        },
        {
          action: 'linkWithEntrepreneurs',
          label: `Vincular a empresarios`,
          icon: 'pi pi-user',
        },
      ],
    };
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.optionsTable.summary = 'Empresas';
    this.tableTitle = 'Empresas';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.businesses
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);
    const entrepreneursForms = await this.formService.getFormByCollection(
      FormCollections.entrepreneurs
    );
    const entrepreneursForm = entrepreneursForms.find(() => true);
    this.tableContext = {
      locator: this.tableLocator,
      name: 'Empresas',
      form: this.entityForm._id,
      joins: [
        {
          name: 'Empresarios',
          key: 'entrepreneurs',
          form: entrepreneursForm._id,
        },
      ],
    };
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    this.loading = false;
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
    pageRequest,
  }: TableActionEvent) {
    switch (action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: 'Create business',
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Creación de empresa'
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.fullRefresh();
          }
        });
        break;
      case 'linkWithEntrepreneurs':
        this.dialogService
          .open(EntrepreneurSelectTableComponent, {
            modal: true,
            height: '100%',
            width: '100%',
          })
          .onClose.pipe(take(1), takeUntil(this.onDestroy$))
          .subscribe(async (data?: TableSelection) => {
            if (!data) return;
            if (!data.selected) return;
            const entrepreneursIds = data.selected;
            if (entrepreneursIds.length) {
              await this.service.linkWithEntrepreneurs(
                entrepreneursIds,
                entrepreneursIds
              );
            } else {
              await this.service.linkWithEntrepreneursByRequest(
                pageRequest,
                entrepreneursIds
              );
            }
          });
        break;
    }
  }
}
