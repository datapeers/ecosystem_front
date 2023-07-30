import { Component, Input } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { ToastService } from '@shared/services/toast.service';
import { Subject, first, firstValueFrom } from 'rxjs';
import { ConfigEvaluation } from '../models/evaluation-config';
import { Phase } from '@home/phases/model/phase.model';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { PhaseEvaluationsService } from '../phase-evaluations.service';

@Component({
  selector: 'app-evaluation-tables',
  templateUrl: './evaluation-tables.component.html',
  styleUrls: ['./evaluation-tables.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: PhaseEvaluationsService },
  ],
})
export class EvaluationTablesComponent {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  entityForm: AppForm;
  onDestroy$: Subject<void> = new Subject();
  showAddExpert = false;
  listExperts = [];
  selectedExperts = [];
  showAddStartups = false;
  listStartups = [];
  selectedStartups = [];
  selectedExpert = null;
  titleStartupDialog = '';
  callbackTable;
  user: User;
  phase: Phase;
  @Input() config: ConfigEvaluation;

  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private readonly formService: FormService,
    private readonly toast: ToastService,
    private store: Store<AppState>
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: '',
      showConfigButton: true,
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
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    this.optionsTable.summary = this.config.title;
    this.tableTitle = this.config.title;
    this.loading = true;
    this.tableContext = {
      locator: `evaluations ${this.config._id}`,
      name: `Evaluation ${this.config._id}`,
      form: this.config.form,
      data: {
        config: this.config._id,
      },
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
    rawDataTable,
  }: TableActionEvent) {
    switch (action) {
      case 'link_expert':
        break;
      case 'expert_startup_link':
        break;
    }
  }
}
