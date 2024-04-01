import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, firstValueFrom, first } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { CommunitiesService } from './communities.service';
import { User } from '@auth/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShepherdService } from 'angular-shepherd';
import { communitiesOnboarding } from '@shared/onboarding/onboarding.config';
import { getPhaseAndNumb } from '@shared/utils/phases.utils';
import { Startup } from '@shared/models/entities/startup';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: CommunitiesService }],
})
export class CommunitiesComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  textSummary = `Mostrando {first} a {last} de {totalRecords}`;

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
  communities_show: any[];
  communities: any[];
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: CommunitiesService,
    private readonly shepherdService: ShepherdService
  ) {
    // this.optionsTable = {
    //   save: true,
    //   download: false,
    //   details: true,
    //   summary: 'Comunidades',
    //   showConfigButton: false,
    //   redirect: null,
    //   selection: false,
    //   actions_row: 'compress',
    //   actionsPerRow: [],
    //   extraColumnsTable: [
    //     {
    //       label: 'Logo',
    //       key: 'thumbnail',
    //       type: TableColumnType.img,
    //       format: 'image',
    //     },
    //     {
    //       label: 'Email',
    //       key: 'entrepreneurs; item, email',
    //       type: TableColumnType.data,
    //       format: 'string',
    //     },
    //     {
    //       label: 'Fases',
    //       key: 'phases; name',
    //       type: TableColumnType.data,
    //       format: 'string',
    //     },
    //     {
    //       label: 'Fase actual',
    //       key: 'lastPhase, name',
    //       type: TableColumnType.data,
    //       format: 'string',
    //     },
    //   ],
    //   actionsTable: [],
    //   hideMultipleFiltersTable: true,
    //   hideCaption: false,
    // };
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

  launchTour() {
    if (!this.user.isUser) return;
    this.shepherdService.addSteps(communitiesOnboarding);
    this.shepherdService.start();
  }

  async loadComponent() {
    const communities = await this.service.getDocuments({});
    this.communities = communities.map((i) => {
      const [lastPhaseName, lastPhaseNumb] = getPhaseAndNumb(i.lastPhase?.name);
      return {
        ...i,
        lastPhaseName,
        lastPhaseNumb,
      };
    });
    this.communities_show = cloneDeep(this.communities);
    this.loading = false;
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

  contact(startup: Startup) {
    this.contactForm = this.newContact(
      this.user.email,
      startup.entrepreneurs
        .filter((i) => i.item['email'])
        .map((i) => i.item['email'])[0]
    );
    this.contactTo = startup;

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
