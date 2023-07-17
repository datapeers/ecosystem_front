import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { AppForm } from '@shared/form/models/form';
import { Subject, firstValueFrom, first } from 'rxjs';
import { Phase } from '../model/phase.model';
import { PhaseStartupsService } from './phase-startups.service';
import { StartupsService } from '@shared/services/startups/startups.service';
import { FormService } from '@shared/form/form.service';
import { ToastService } from '@shared/services/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { FormCollections } from '@shared/form/enums/form-collections';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { Permission } from '@auth/models/permissions.enum';

@Component({
  selector: 'app-phase-startups',
  templateUrl: './phase-startups.component.html',
  styleUrls: ['./phase-startups.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: PhaseStartupsService }],
})
export class PhaseStartupsComponent implements OnInit, OnDestroy {
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
  phase: Phase;
  callbackTable;
  user: User;
  constructor(
    private service: PhaseStartupsService,
    private readonly startupsService: StartupsService,
    private readonly formService: FormService,
    private readonly toast: ToastService,
    private store: Store<AppState>
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: 'StartUps',
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
    this.optionsTable.summary = 'StartUps';
    this.tableTitle = 'StartUps';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);

    this.tableContext = {
      locator: `startups phase ${this.phase._id}`,
      name: 'StartUps',
      form: this.entityForm._id,
      data: {
        phase: this.phase._id,
      },
    };
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    if (
      [ValidRoles.admin, ValidRoles.superAdmin, ValidRoles.host].includes(
        this.user.rolType as ValidRoles
      )
    )
      this.optionsTable.actionsTable.push({
        action: 'link_startup',
        label: `Añadir startUp`,
        icon: 'pi pi-plus',
        featured: true,
      });

    this.loading = false;
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
  }: TableActionEvent) {
    switch (action) {
      case 'link_startup':
        this.listStartups = (await this.startupsService.getDocuments({})).map(
          (doc) => {
            return {
              _id: doc._id,
              name: doc.item.nombre,
            };
          }
        );
        this.callbackTable = callbacks;
        this.showAddStartups = true;
        break;
    }
  }

  addStartUpPhase() {
    this.toast.info({ summary: 'Agregando...', detail: '' });
    this.service
      .linkStartupToBatch(
        this.phase._id,
        this.phase.name,
        this.selectedStartups
      )
      .then((ans) => {
        this.toast.clear();
        this.callbackTable.refresh();
        this.resetStartupsDialog();
      })
      .catch((err) => {
        console.warn(err);
        this.resetStartupsDialog();
        this.toast.clear();
        this.toast.error({
          summary: 'Error al intentar vincular startup',
          detail: err,
        });
      });
  }

  resetStartupsDialog() {
    this.selectedStartups = [];
    this.showAddStartups = false;
    this.callbackTable = undefined;
  }
}
