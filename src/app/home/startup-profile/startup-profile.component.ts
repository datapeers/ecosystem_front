import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';
import { FormService } from '../../shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { Table } from 'primeng/table';
import { RolStartup, rolStartupNames } from './models/rol-startup.enum';
@Component({
  selector: 'app-startup-profile',
  templateUrl: './startup-profile.component.html',
  styleUrls: ['./startup-profile.component.scss'],
})
export class StartupProfileComponent implements OnInit, OnDestroy {
  user: User;
  loaded = false;
  profileDoc;
  startup: Startup;
  formStartup;
  formNegociosFields = [];
  noValuePlaceholder: string = '- - - -';
  textSummary = `Mostrando {first} a {last} de {totalRecords}`;
  onDestroy$: Subject<void> = new Subject();
  leaderStartup;
  @ViewChild('dt', { static: true }) dt: Table;

  public get rolStartups(): typeof RolStartup {
    return RolStartup;
  }

  public get rolStartupsNames(): typeof rolStartupNames {
    return rolStartupNames;
  }

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private startupService: StartupsService,
    private formService: FormService
  ) {
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
    this.loaded = false;
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    const startup = this.profileDoc.startups[0];
    this.startup = await this.startupService.getDocument(startup._id);
    this.leaderStartup = this.startup.entrepreneurs.find(
      (i) => i.rol === 'leader'
    );
    const formsStartups = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!formsStartups.length) {
      return;
    }
    this.formStartup = formsStartups.find(() => true);
    const formNegociosComponents = this.formService.getFormComponents(
      this.formStartup
    );
    const ignore = ['nombre', 'descripcion'];
    this.formNegociosFields = this.formService
      .getInputComponents(formNegociosComponents)
      .filter((i) => !ignore.includes(i.key));
    this.loaded = true;
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Pagina ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }

  async editStartup() {
    this.toast.loading();
    const subscription = await this.formService.createFormSubscription({
      form: this.formStartup._id,
      reason: 'Editar startup',
      data: {},
      doc: this.startup._id,
    });
    this.toast.clear();
    const ref = this.formService.openFormFromSubscription(
      subscription,
      'Editar startup'
    );
    ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe(async (doc) => {
      if (doc) {
        this.startup = await this.startupService.getDocument(this.startup._id);
      }
    });
  }
}
