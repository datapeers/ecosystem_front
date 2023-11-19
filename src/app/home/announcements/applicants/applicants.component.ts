import { Component } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
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
import { FormService } from '@shared/form/form.service';
import { ApplicantsService } from '@shared/services/applicants/applicants.service';
import { Subject, take, takeUntil, firstValueFrom, first } from 'rxjs';
import { Announcement } from '../model/announcement';
import { DialogService } from 'primeng/dynamicdialog';
import { ApplicantStateEditComponent } from './applicant-state-edit/applicant-state-edit.component';
import { Applicant } from '@shared/models/entities/applicant';
import {
  ApplicationStates,
  applicationStatesUtilities,
} from '../model/application-states.enum';
import { ActivatedRoute } from '@angular/router';
import { ApplicantState } from '../model/applicant-state';
import { User } from '@auth/models/user';
import { Permission } from '@auth/models/permissions.enum';
import { applicantStates } from 'src/app/public/landing/landing.component';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: ApplicantsService }],
})
export class ApplicantsComponent {
  optionsTable: TableOptions;
  tableContext: TableContext;
  loading: boolean = false;
  tableTitle: string = '';
  configTable: TableConfig;
  tableLocator: string;
  onDestroy$: Subject<void> = new Subject();
  announcement: Announcement;
  applicantState: ApplicantState;
  currentState: ApplicationStates;
  nextState: ApplicationStates | null;
  user: User;
  constructor(
    private readonly formService: FormService,
    private readonly dialogService: DialogService,
    private readonly store: Store<AppState>,
    private readonly applicantsService: ApplicantsService,
    route: ActivatedRoute
  ) {
    route.params.subscribe((params) => {
      const state = params['state'];
      this.loading = true;
      this.currentState = state;
      const nextState = applicationStatesUtilities.nextApplicationState(state);
      const rowActions = [];
      this.nextState = nextState;
      if (nextState) {
        const label = applicationStatesUtilities.stateChangeLabel(state);
        rowActions.push({
          action: 'update',
          label: label,
          icon: 'pi pi-plus',
        });
      }
      this.applicantState = state;
      this.optionsTable = {
        save: true,
        download: true,
        details: true,
        summary: 'Inscritos',
        showConfigButton: true,
        redirect: null,
        selection: true,
        actions_row: 'compress',
        actionsPerRow: [
          {
            action: 'details',
            label: `Editar estado`,
            icon: 'pi pi-pencil',
          },
          ...rowActions,
        ],
        extraColumnsTable: [],
        actionsTable: [
          {
            action: 'add',
            label: `Nuevo Inscrito`,
            icon: 'pi pi-plus',
            featured: true,
          },
        ],
      };
      if (this.currentState === ApplicationStates.selected) {
        this.optionsTable.extraColumnsTable = [
          {
            label: 'Batch seleccionado',
            key: 'batch, nombre',
            type: TableColumnType.data,
            format: 'string',
          },
        ];
      }
      this.loadComponent();
    });
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
    const announcementChanges = this.store.select(
      (state) => state.announcement.announcement
    );
    this.announcement = await firstValueFrom(announcementChanges);
    this.tableLocator = `${tableLocators.applicants}${this.announcement._id}${this.currentState}`;
    this.optionsTable.summary = 'Inscritos';
    this.tableTitle = 'Inscritos';
    this.loading = true;
    this.tableContext = {
      locator: this.tableLocator,
      name: 'Inscritos',
      form: this.announcement.form._id,
      data: {
        announcement: this.announcement._id,
        state: this.applicantState,
      },
    };
    this.user = await firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    );
    if (this.user.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    this.loading = false;
  }

  async actionFromTable({
    action,
    element,
    event,
    callbacks,
  }: TableActionEvent<Applicant>) {
    switch (action) {
      case 'add':
        const subscription = await this.formService.createFormSubscription({
          form: this.announcement.form._id,
          reason: 'Create applicant',
          data: {
            announcement: this.announcement._id,
          },
        });
        const ref = this.formService.openAnnouncementFromSubscription(
          this.announcement,
          undefined,
          subscription,
          true
        );
        ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
          if (doc) {
            callbacks.fullRefresh();
          }
        });
        break;
      case 'details':
        this.updateStateDialog(
          'Edición de estado',
          element._id,
          this.currentState
        );
        break;
      case 'update':
        const header = applicationStatesUtilities.stateChangeLabel(
          this.currentState
        );
        this.updateStateDialog(header, element._id, this.nextState);
        break;
    }
  }

  updateStateDialog(
    header: string,
    applicantId: string,
    state: ApplicationStates
  ) {
    this.dialogService.open(ApplicantStateEditComponent, {
      header: '',
      maskStyleClass: 'dialog-app',
      data: {
        announcementId: this.announcement._id,
        id: applicantId,
        currentState: state,
      },
    });
  }
}
