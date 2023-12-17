import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '@auth/models/user';
import { Startup } from '@shared/models/entities/startup';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { RolStartup, rolStartupNames } from '../models/rol-startup.enum';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { textField } from '@shared/utils/order-field-multiple';

@Component({
  selector: 'app-startup-dialog',
  templateUrl: './startup-dialog.component.html',
  styleUrls: ['./startup-dialog.component.scss'],
})
export class StartupDialogComponent implements OnInit, OnDestroy {
  loaded = false;
  user: User;
  startup: Startup;
  leaderStartup;
  resources: [];
  formStartup;
  formNegociosFields = [];
  noValuePlaceholder: string = '- - - -';
  textSummary = `Visualizando {first} a {last} de {totalRecords} entradas`;
  onDestroy$: Subject<void> = new Subject();

  @ViewChild('dt', { static: true }) dt: Table;
  public get rolStartups(): typeof RolStartup {
    return RolStartup;
  }

  public get rolStartupsNames(): typeof rolStartupNames {
    return rolStartupNames;
  }

  constructor(
    public config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef,
    private toast: ToastService,
    private startupService: StartupsService,
    private formService: FormService
  ) {
    this.startup = this.config.data.startup;
    this.leaderStartup = this.config.data.leaderStartup;
    this.user = this.config.data.user;
  }

  async ngOnInit() {
    this.loaded = false;
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
    // console.log(this.formNegociosFields);

    if (this.user.isExpert) {
      console.log('entra como expert');
      this.resources = [];
    }
    this.loaded = true;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Pagina ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }

  valueFieldMultiple(values: string[], text: Record<string, any>) {
    return textField(values, text);
  }
}
