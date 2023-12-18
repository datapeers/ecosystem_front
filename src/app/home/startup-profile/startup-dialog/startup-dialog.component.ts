import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '@auth/models/user';
import { Startup } from '@shared/models/entities/startup';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, take, takeUntil } from 'rxjs';
import { RolStartup, rolStartupNames } from '../models/rol-startup.enum';
import { FormService } from '@shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { textField } from '@shared/utils/order-field-multiple';
import { PhasesService } from '@home/phases/phases.service';
import { PhaseContentService } from '@home/phases/phase-content/phase-content.service';
import { PhaseHomeworksService } from '@home/phases/phase-homeworks/phase-homeworks.service';
import { ResourceReply } from '@home/phases/phase-homeworks/model/resource-reply.model';
import { ResourcesTypes } from '@home/phases/model/resources-types.model';

@Component({
  selector: 'app-startup-dialog',
  templateUrl: './startup-dialog.component.html',
  styleUrls: ['./startup-dialog.component.scss'],
})
export class StartupDialogComponent implements OnInit, OnDestroy {
  loaded = false;
  user: User;
  startupId: string;
  startup: Startup;
  leaderStartup;
  resources: { label: string; resources: ResourceReply[] }[];
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
    private formService: FormService,
    private phasesService: PhasesService,
    private phaseContentService: PhaseContentService,
    private phaseHomeworksService: PhaseHomeworksService
  ) {
    this.startupId = this.config.data.startupId;
    this.user = this.config.data.user;
  }

  async ngOnInit() {
    this.loaded = false;
    this.startup = await this.startupService.getDocument(this.startupId);
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
      this.resources = [];
      const startupBatchList = (
        await this.phasesService.getPhasesList(
          this.startup.phases.map((i) => i._id),
          true
        )
      ).filter((i) => !i.basePhase);
      for (const batch of startupBatchList) {
        const resources = (
          await this.phaseHomeworksService.getResourcesByBatch(
            this.startup._id,
            batch._id
          )
        ).filter((i) => i.resource.type !== ResourcesTypes.downloadable);
        this.resources.push({
          label: batch.name,
          resources,
        });
      }
      console.log(this.resources);
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

  viewResource(resource: ResourceReply) {
    console.log(resource);
    switch (resource.resource.type) {
      case ResourcesTypes.form:
        console.log('formulario');
        this.openForm(resource);
        break;
      case ResourcesTypes.task:
        console.log('reply');
        this.downloadFileReply(resource);
        break;
      default:
        break;
    }
  }

  async openForm(reply: ResourceReply) {
    const ref = await this.phaseHomeworksService.openFormResource(reply, true);
    if (ref) ref.pipe(take(1), takeUntil(this.onDestroy$));
  }

  async downloadFileReply(reply: ResourceReply) {
    this.phaseHomeworksService.downloadFileReply(reply);
  }
}
