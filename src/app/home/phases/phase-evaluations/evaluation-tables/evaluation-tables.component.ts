import { Component, Input } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import {
  TableColumn,
  TableColumnType,
  TableConfig,
} from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormCollections } from '@shared/form/enums/form-collections';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { ToastService } from '@shared/services/toast.service';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';
import { ConfigEvaluation } from '../models/evaluation-config';
import { Phase } from '@home/phases/model/phase.model';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { PhaseEvaluationsService } from '../phase-evaluations.service';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { IEvaluation } from '../models/evaluation';
import * as moment from 'moment';
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
    const extraColumnsTable: TableColumn[] = [
      // {
      //   label: 'Evaluado el',
      //   key: 'createdAt',
      //   type: TableColumnType.data,
      //   format: 'date',
      // },
    ];
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
      extraColumnsTable: extraColumnsTable,
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
      locator: `evaluation ${this.config._id}`,
      name: `Evaluation ${this.config._id}`,
      form: this.config.form,
      data: {
        config: this.config._id,
      },
    };
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    if (
      this.user.allowed(Permission.evaluation_edit_docs) ||
      this.allowEvaluate(this.user.rolType)
    )
      this.optionsTable.actionsPerRow.push({
        action: 'evaluated',
        label: `Evaluación`,
        icon: 'pi pi-book',
        featured: true,
      });
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
      case 'evaluated':
        if (!this.validDate()) return;
        const item: IEvaluation = rawDataTable.find(
          (i) => i._id === element._id
        );
        const subscription = await this.formService.createFormSubscription({
          form: this.config.form,
          reason: 'Evaluar',
          data: {
            evaluated: item.evaluated,
            reviewer: this.user._id,
            config: this.config._id,
            form: this.config.form,
          },
          doc: item.state === 'pendiente' ? undefined : item._id,
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Evaluar'
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.fullRefresh();
          }
        });
        break;
    }
  }

  allowEvaluate(rol: ValidRoles) {
    if ([ValidRoles.admin, ValidRoles.superAdmin].includes(rol)) return true;
    if (rol === this.config.reviewer) return true;
    return false;
  }

  validDate() {
    // if (this.user.masterRol) {
    //   return true;
    // }
    if (moment(new Date()).isBefore(this.config.startAt)) {
      this.toast.alert({
        summary: 'Aun no se puede evaluar',
        detail: `Las evaluaciones comienzan el ${moment(
          this.config.endAt
        ).format('DD-M-yy, h:mm a')}`,
      });
      return false;
    }
    if (moment(new Date()).isAfter(this.config.endAt)) {
      this.toast.alert({
        summary: 'Las evaluaciones han terminado',
        detail: `Las evaluaciones terminaron el ${moment(
          this.config.endAt
        ).format('DD-M-yy, h:mm a')}`,
      });
      return false;
    }
    return true;
  }
}
