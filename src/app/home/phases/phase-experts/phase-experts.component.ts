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
import { Subject, take, takeUntil } from 'rxjs';
import { PhasesService } from '../phases.service';
import { ActivatedRoute } from '@angular/router';
import { PhaseExpertsService } from './phase-experts.service';

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
  phaseId;
  constructor(
    private service: PhaseExpertsService,
    private readonly route: ActivatedRoute,
    private readonly phasesService: PhasesService,
    private readonly formService: FormService,
    private readonly toast: ToastService
  ) {
    this.phaseId = route.snapshot.paramMap.get('id');
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
      locator: `experts phase ${this.phaseId}`,
      name: 'Expertos',
      form: this.entityForm._id,
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
        const subscription = await this.formService.createFormSubscription({
          form: this.entityForm._id,
          reason: 'Create expert',
        });
        const ref = this.formService.openFormFromSubscription(
          subscription,
          'Creación de experto'
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.refresh();
          }
        });
        break;
    }
  }
}
