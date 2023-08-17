import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { Content } from '@home/phases/model/content.model';
import { Phase } from '@home/phases/model/phase.model';
import { Resource } from '@home/phases/model/resource.model';
import { Store } from '@ngrx/store';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import {
  TableColumn,
  TableConfig,
} from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormService } from '@shared/form/form.service';
import { AppForm } from '@shared/form/models/form';
import { ToastService } from '@shared/services/toast.service';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ResourcesTypes } from '@home/phases/model/resources-types.model';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { PhaseHomeworksService } from '../phase-homeworks.service';
import { IResourceReply, ResourceReply } from '../model/resource-reply.model';
import { Startup } from '@shared/models/entities/startup';
import { ResourceReplyState } from '../model/resource-reply-states';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-phase-homework-table',
  templateUrl: './phase-homework-table.component.html',
  styleUrls: ['./phase-homework-table.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: PhaseHomeworksService },
  ],
})
export class PhaseHomeworkTableComponent implements OnInit, OnDestroy {
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
  loadingTable = true;
  tableForm = false;
  tableRows = [];
  @Input() resource: Resource;
  @Input() sprint: Content;

  replyForEvaluated: ResourceReply;
  showDialogEvaluation = false;
  saving = false;
  callBackTable;
  possibleEvaluations = [
    ResourceReplyState['Sin evaluar'],
    ResourceReplyState.Evaluado,
    ResourceReplyState.Aprobado,
  ];
  public get userPermission(): typeof Permission {
    return Permission;
  }

  public get resourcesTypes(): typeof ResourcesTypes {
    return ResourcesTypes;
  }

  constructor(
    private store: Store<AppState>,
    private service: PhaseHomeworksService,
    private readonly formService: FormService,
    private readonly toast: ToastService
  ) {
    const extraColumnsTable: TableColumn[] = [];
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.loadingTable = true;
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    switch (this.resource.type) {
      case ResourcesTypes.downloadable:
        this.loadNormalTable();
        break;
      case ResourcesTypes.form:
        this.loadTableForm();
        break;
      case ResourcesTypes.task:
        this.loadNormalTable();
        break;
      default:
        this.toast.alert({
          summary: 'Tipo de tarea no soportable',
          detail:
            'Esta tarea es de un tipo que no esta considerado en el diseño de tablas',
        });
        return;
    }
    this.loading = false;
  }

  async loadNormalTable() {
    this.optionsTable.summary = '';
    this.tableTitle = this.resource.name;
    this.loading = true;
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    this.tableRows = await this.service.getDocuments({
      resource: this.resource._id,
      sprint: this.sprint._id,
    });
    this.loadingTable = false;
  }

  async loadTableForm() {
    this.optionsTable.summary = '';
    this.tableTitle = this.resource.name;
    this.loading = true;
    this.tableContext = {
      locator: `resource replies ${this.resource._id}`,
      name: `Resource replies ${this.resource._id}`,
      form: this.resource.extra_options.form,
      data: {
        resource: this.resource._id,
        sprint: this.sprint._id,
      },
    };
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    if (this.allowEvaluate(this.user.rolType))
      this.optionsTable.actionsPerRow.push({
        action: 'evaluated',
        label: `Calificar`,
        icon: 'pi pi-check',
        featured: true,
      });
    this.tableForm = true;
    this.loadingTable = false;
  }

  allowEvaluate(rol: ValidRoles) {
    if (this.resource.type === ResourcesTypes.downloadable) return false;
    if ([ValidRoles.admin, ValidRoles.superAdmin].includes(rol)) return true;
    if (this.user.allowed(Permission.homeworks_evaluate)) return true;
    return false;
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
        const item: ResourceReply = rawDataTable.find(
          (i) => i._id === element._id
        );
        this.callBackTable = callbacks;
        this.evaluate(item);
        break;
    }
  }

  validDate() {
    if (moment(new Date()).isBefore(this.sprint.extra_options.start)) {
      this.toast.alert({
        summary: 'Aun no se puede evaluar',
        detail: `Las evaluaciones comienzan el ${moment(
          this.resource.extra_options.start
        ).format('DD-M-yy, h:mm a')}`,
      });
      return false;
    }
    return true;
  }

  evaluate(reply: ResourceReply) {
    if (
      reply.state === ResourceReplyState['Sin descargar'] ||
      reply.state === ResourceReplyState.Pendiente
    ) {
      this.toast.info({
        summary: 'No se puede calificar',
        detail:
          'Esta tarea aun esta pendiente de ser realizada por la startup, por lo cual no puede ser calificada',
      });
      return;
    }
    this.replyForEvaluated = cloneDeep(reply);
    this.showDialogEvaluation = true;
  }

  saveEvaluation() {
    if (moment(new Date()).isAfter(this.resource.extra_options.end)) {
      this.toast.info({
        summary: 'Fecha limite',
        detail: 'Esta tarea ya supero el tiempo limite para su realización',
      });
      return;
    }
    this.service
      .updateReply({
        _id: this.replyForEvaluated._id,
        state: this.replyForEvaluated.state,
        observations: this.replyForEvaluated.observations,
        modified: false,
      })
      .then((reply) => {
        this.toast.clear();
        this.resetDialog();
        this.loadComponent();
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({
          summary: 'Fallo al registrar archivo subido',
          detail: err,
        });
        this.resetDialog();
      });
  }

  async downloadFileReply(reply: ResourceReply) {
    this.service.downloadFileReply(reply);
  }

  resetDialog() {
    this.showDialogEvaluation = false;
    if (this.callBackTable) {
      this.callBackTable.fullRefresh();
      this.callBackTable = undefined;
    }
    this.replyForEvaluated = undefined;
  }
}
