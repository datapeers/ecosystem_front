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
import { StartupsService } from '@shared/services/startups/startups.service';
import { Expert } from '@shared/models/entities/expert';

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
  selectedExperts = [];
  phase: Phase;
  showAddStartups = false;
  listStartups = [];
  selectedStartups = [];
  selectedExpert = null;
  titleStartupDialog = '';
  constructor(
    private service: PhaseExpertsService,
    private readonly expertsService: ExpertsService,
    private readonly startupsService: StartupsService,
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
      actionsPerRow: [
        {
          action: 'expert_startup_link',
          label: `Adjuntar startUp`,
          icon: 'pi pi-link',
          featured: true,
        },
      ],
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
    rawDataTable,
  }: TableActionEvent) {
    switch (action) {
      case 'link_expert':
        const posibleExperts = (await this.expertsService.getDocuments({})).map(
          (doc) => {
            return {
              _id: doc._id,
              name: doc.item.nombre,
            };
          }
        );
        this.listExperts = [];
        for (const iterator of posibleExperts) {
          if (rawDataTable.find((i) => i._id === iterator._id)) continue;
          this.listExperts.push(iterator);
        }
        this.showAddExpert = true;
        break;
      case 'expert_startup_link':
        const listStartups = (await this.startupsService.getDocuments({})).map(
          (doc) => {
            return {
              _id: doc._id,
              name: doc.item.nombre,
            };
          }
        );
        let startupsWithExpert = new Set();
        for (const expert of rawDataTable) {
          const expertPhase = expert['phases'].find(
            (i) => i._id === this.phase._id
          );

          for (const iterator of expertPhase.startUps) {
            startupsWithExpert.add(iterator);
          }
        }
        for (const iterator of listStartups) {
          if (startupsWithExpert.has(iterator._id)) continue;
          this.listStartups.push(iterator);
        }
        this.selectedExpert = element;
        this.titleStartupDialog = `Agregar startups para ${element['item, nombre']}`;
        this.showAddStartups = true;
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

  addExpertStartupPhase() {
    this.toast.info({ summary: 'Agregando...', detail: '' });
    // const expertPhase = this.selectedExpert['phases'].find(
    //   (i) => i._id === this.phase._id
    // );
    this.service
      .linkStartups(
        this.selectedExpert._id,
        this.phase._id,
        this.selectedStartups
      )
      .then((ans) => {
        this.toast.clear();
        this.resetStartupsExpertDialog();
      })
      .catch((err) => {
        console.warn(err);
        this.resetExpertsDialog;
        this.toast.clear();
        this.toast.error({
          summary: 'Error al intentar vincular startups a experto',
          detail: err,
        });
      });
  }

  resetStartupsExpertDialog() {
    this.selectedStartups = [];
    this.showAddStartups = false;
    this.selectedExpert = null;
  }
}
