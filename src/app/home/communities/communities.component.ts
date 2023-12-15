import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicTable } from '@shared/components/dynamic-table/models/dynamic-table';
import {
  TableColumnType,
  TableConfig,
} from '@shared/components/dynamic-table/models/table-config';
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
import { Permission } from '@auth/models/permissions.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  contactTo;
  contactForm: FormGroup;
  sending = false;
  get formControls() {
    return this.contactForm.controls;
  }

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
      selection: false,
      actions_row: 'compress',
      actionsPerRow: [],
      extraColumnsTable: [
        {
          label: 'Email',
          key: 'entrepreneurs; item, email',
          type: TableColumnType.data,
          format: 'string',
        },
        {
          label: 'Fases',
          key: 'phases; name',
          type: TableColumnType.data,
          format: 'string',
        },
        {
          label: 'Fase actual',
          key: 'lastPhase, name',
          type: TableColumnType.data,
          format: 'string',
        },
      ],
      actionsTable: [],
      hideMultipleFiltersTable: true,
      hideCaption: false,
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
    this.optionsTable.summary = 'Lista';
    this.tableTitle = 'Lista';
    this.loading = true;
    const forms = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!forms.length) {
      return;
    }
    this.entityForm = forms.find(() => true);
    const entrepreneursForms = await this.formService.getFormByCollection(
      FormCollections.entrepreneurs
    );
    const entrepreneursForm = entrepreneursForms.find(() => true);
    this.tableContext = {
      locator: `communities`,
      name: 'Comunidades',
      form: this.entityForm._id,
      data: {},
      joins: [],
    };
    if (this.user?.allowed(Permission.download_all_tables))
      this.optionsTable.download = true;
    if (this.user?.allowed(Permission.community_edit))
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

  newContact(from: string, to: string) {
    return new FormGroup({
      subject: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      body: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      from: new FormControl<string>(from ?? '', {
        validators: [Validators.required, Validators.email],
      }),
      to: new FormControl<string>(to ?? '', {
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  contact(row) {
    this.contactForm = this.newContact(
      this.user.email,
      row['entrepreneurs; item, email'][0]
    );
    this.contactTo = row;

    this.sending = false;
  }

  async sendContact() {
    this.sending = true;
    try {
      await this.service.contact(
        this.contactForm.value.body,
        this.contactForm.value.from,
        this.contactForm.value.subject,
        this.contactForm.value.to
      );
      this.toast.success({ summary: 'Mensaje enviado', detail: '' });
      this.contactTo = undefined;
      this.sending = false;
    } catch (error) {
      this.sending = false;
      this.toast.error({
        summary: 'Error al intentar contactar',
        detail: error,
      });
    }
    //email     this.toContact = row['entrepreneurs; item, email'][0];
    // await this.service.contact(this.bodyContact,. this.subjectContact, this.to)
  }
}
