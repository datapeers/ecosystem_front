import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
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
import { PhaseExpertsService } from './phase-experts.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Phase } from '../model/phase.model';
import { ExpertsService } from '@shared/services/experts/experts.service';

@Component({
  selector: 'app-phase-experts',
  templateUrl: './phase-experts.component.html',
  styleUrls: ['./phase-experts.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: PhaseExpertsService }],
})
export class PhaseExpertsComponent implements OnInit, OnDestroy {
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
  selectedExperts: [] = [];
  phase: Phase;
  constructor(
    private service: PhaseExpertsService,
    private readonly expertsService: ExpertsService,
    private readonly formService: FormService,
    private readonly toast: ToastService,
    private store: Store<AppState>
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: 'Expertos',
      showConfigButton: true,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'link_expert',
          label: `Añadir experto`,
          icon: 'pi pi-plus',
          featured: true,
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
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    this.optionsTable.summary = 'Expertos';
    this.tableTitle = 'Expertos';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.experts
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);

    this.tableContext = {
      locator: `experts phase ${this.phase._id}`,
      name: 'Expertos',
      form: this.entityForm._id,
      data: {
        phase: this.phase._id,
      },
    };
    this.loading = false;
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
  }: TableActionEvent) {
    switch (action) {
      case 'link_expert':
        this.listExperts = (await this.expertsService.getDocuments({})).map(
          (doc) => {
            return {
              _id: doc._id,
              name: doc.item.nombre,
            };
          }
        );
        this.showAddExpert = true;
        break;
    }
  }

  addExpertPhase() {
    this.toast.info({ summary: 'Agregando...', detail: '' });
    this.service
      .linkExpertToBatch(this.phase._id, this.phase.name, this.selectedExperts)
      .then((ans) => {
        this.toast.clear();
        this.resetExpertsDialog();
      })
      .catch((err) => {
        console.warn(err);
        this.resetExpertsDialog;
        this.toast.clear();
        this.toast.error({
          summary: 'Error al intentar vincular expertos',
          detail: err,
        });
      });
  }

  resetExpertsDialog() {
    this.selectedExperts = [];
    this.showAddExpert = false;
  }
}
