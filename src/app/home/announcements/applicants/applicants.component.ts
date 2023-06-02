import { Component } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import { TableActionEvent } from '@shared/components/dynamic-table/models/table-action';
import { TableConfig } from '@shared/components/dynamic-table/models/table-config';
import { TableContext } from '@shared/components/dynamic-table/models/table-context';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { FormService } from '@shared/form/form.service';
import { ApplicantsService } from '@shared/services/applicants/applicants.service';
import { Subject, take, takeUntil, firstValueFrom } from 'rxjs';
import { Announcement } from '../model/announcement';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
  providers: [
    { provide: DocumentProvider, useExisting: ApplicantsService }
  ]
})
export class ApplicantsComponent {
  optionsTable: TableOptions;
  dynamicTable: DynamicTable;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string;
  tableHeightOffset: number = 0;
  onDestroy$: Subject<void> = new Subject();
  announcement: Announcement;

  constructor(
    private readonly formService: FormService,
    private readonly store: Store<AppState>
  ) {
    this.optionsTable = {
      save: true,
      download: false,
      details: true,
      summary: "Inscritos",
      showConfigButton: true,
      redirect: null,
      selection: true,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [],
      actionsTable: [
        {
          action: 'add',
          label: `Nuevo Inscrito`,
          icon: 'pi pi-plus',
          featured: true
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
    const announcementChanges = this.store.select(state => state.announcement.announcement);
    this.announcement = await firstValueFrom(announcementChanges);
    this.tableLocator = `${tableLocators.applicants}${this.announcement._id}`;
    this.optionsTable.summary = "Inscritos";
    this.tableTitle = "Inscritos";
    this.loading = true;
    this.tableContext = {
      locator: this.tableLocator,
      name: "Inscritos",
      form: this.announcement.form._id,
      data: {
        announcement: this.announcement._id
      }
    }
    this.loading = false;
  }

  async actionFromTable({ action, element, event, callbacks }: TableActionEvent) {
    switch(action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.announcement.form._id,
          reason: "Create applicant",
        });
        const ref = this.formService.openFormFromSubscription(subscription, "Creación de inscrito");
        ref.pipe(
          take(1),
          takeUntil(this.onDestroy$)
        ).subscribe((doc) => {
          if(doc) {
            callbacks.refresh();
          }
        });
        break;
    }
  }
}
