import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { AppForm } from '@shared/form/models/form';
import { Subject, firstValueFrom, first } from 'rxjs';
import { FormService } from '@shared/form/form.service';
import { ToastService } from '@shared/services/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { FormCollections } from '@shared/form/enums/form-collections';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { CommunitiesService } from './communities.service';
import { RowConfigColumn } from '@shared/models/row-config-column';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: CommunitiesService }],
})
export class CommunitiesComponent implements OnInit, OnDestroy {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();
  showAddStartups = false;
  listStartups = [];
  selectedStartups: [] = [];
  callbackTable;
  user: User;
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: CommunitiesService,
    private readonly formService: FormService
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: 'Comunidades',
      showConfigButton: false,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [],
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
    this.optionsTable.summary = 'Comunidades';
    this.tableTitle = 'Comunidades';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);
    this.tableContext = {
      locator: `communities`,
      name: 'Comunidades',
      form: this.entityForm._id,
      data: {},
    };
    if (this.user.rol.permissions?.download_tables)
      this.optionsTable.download = true;
    if (this.user.rol.permissions?.community?.edit)
      this.optionsTable.showConfigButton = true;
    this.loading = false;
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
  }: TableActionEvent) {
    switch (action) {
      case 'test':
        break;
    }
  }
}
