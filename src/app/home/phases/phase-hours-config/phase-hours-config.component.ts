import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { ToastService } from '@shared/services/toast.service';
import { PhaseHourConfigService } from './phase-hour-config.service';
import { Subscription, first, firstValueFrom, filter } from 'rxjs';
import { Phase } from '../model/phase.model';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import {
  ActivitiesConfig,
  IActivityConfigInput,
  IAssign,
} from './models/activities.model';
import { PhaseEventsService } from '../phase-events/phase-events.service';

import { User } from '@auth/models/user';
import { Permission } from '@auth/models/permissions.enum';
import {
  ColumnHour,
  columnsHours,
  columnsHoursLabels,
} from './models/columns-hours.enum';
import { TypeEvent } from '../phase-events/models/types-events.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-phase-hours-config',
  templateUrl: './phase-hours-config.component.html',
  styleUrls: ['./phase-hours-config.component.scss'],
})
export class PhaseHoursConfigComponent implements OnInit, OnDestroy {
  loaded = false;
  saving: boolean = false;
  activitiesConfig: ActivitiesConfig;
  watchConfig$: Subscription;
  phase: Phase;
  typesActivities: TypeEvent[];
  showActivityConfig: IActivityConfigInput[] = [];
  user: User;

  listStartups = [];
  changesStartups = [];

  listExperts = [];
  changesExperts = [];
  columnsExpertsHours: ColumnHour[] = [
    {
      property: columnsHours.allocated,
      label: columnsHoursLabels.allocated,
      canEdit: true,
    },
    {
      property: columnsHours.donated,
      label: columnsHoursLabels.donated,
      canEdit: false,
    },
    {
      property: columnsHours.done,
      label: columnsHoursLabels.done,
      canEdit: false,
    },
  ];
  activitiesExpert: IActivityConfigInput[] = [];

  listTeamCoaches = [];
  changesTeamCoaches = [];
  columnsTeamCoachesHours: ColumnHour[] = [
    {
      property: columnsHours.allocated,
      label: columnsHoursLabels.allocated,
      canEdit: true,
    },
    {
      property: columnsHours.done,
      label: columnsHoursLabels.done,
      canEdit: false,
    },
  ];
  idTeamCoachActivities = ['646f953cc2305c411d73f700'];
  activitiesTeamCoach: IActivityConfigInput[] = [];
  urlSafe;
  public get userPermission(): typeof Permission {
    return Permission;
  }

  constructor(
    public sanitizer: DomSanitizer,
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: PhaseHourConfigService,
    private readonly activitiesTypesService: PhaseEventsService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://ecometabase.vinku.co/public/dashboard/2b8bf28e-a974-4948-80b9-ffff7df43d79'
    );
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.watchConfig$?.unsubscribe();
  }

  async loadComponent() {
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    this.typesActivities = (
      await this.activitiesTypesService.getTypesEvents()
    ).filter((x) => !x.isDeleted);
    this.watchConfig$ = (
      await this.service.watchConfig(this.phase._id)
    ).subscribe(async (i) => {
      this.loaded = false;
      this.activitiesConfig = cloneDeep(i);

      // Lists
      this.listStartups = this.activitiesConfig.calcHours.hoursAssignStartups;
      this.listExperts = this.activitiesConfig.calcHours.hoursAssignExperts;
      this.listTeamCoaches =
        this.activitiesConfig.calcHours.hoursAssignTeamCoaches;

      // Vars
      let index = 0;
      this.setLists();
      for (const activity of this.typesActivities) {
        const prevConfig = this.activitiesConfig.activities.find(
          (i) => i.id === activity._id
        );
        const expertFocus = activity.expertFocus;
        const teamCoachFocus = this.idTeamCoachActivities.includes(
          activity._id
        );
        const configActivity: IActivityConfigInput = {
          id: activity._id,
          limit: 0,
          ...prevConfig,
          activityName: activity.name,
          expertFocus,
          teamCoachFocus,
        };
        delete configActivity['__typename'];
        this.showActivityConfig.push(configActivity);
        index++;

        if (expertFocus) this.activitiesExpert.push(configActivity);
        if (teamCoachFocus) this.activitiesTeamCoach.push(configActivity);
      }
      this.loaded = true;
    });
  }

  setLists() {
    // Lists
    this.showActivityConfig = [];
    this.activitiesExpert = [];
    this.activitiesTeamCoach = [];

    // Changes
    this.changesStartups = [];
    this.changesExperts = [];
    this.changesTeamCoaches = [];
  }

  saveConfig() {
    this.saving = true;
    this.updateConfig();
  }

  async updateConfig() {
    this.service
      .updateConfig(this.activitiesConfig._id, {
        activities: this.showActivityConfig.map((i) =>
          this.service.setActivityToSave(i)
        ),
        experts: this.updateExpertAssign(),
        teamCoaches: this.updateTeamCoachAssign(),
        startups: this.updateStartupsAssign(),
        limit: this.activitiesConfig.limit,
      })
      .then((res) => {
        if (res) {
          this.toast.success({
            summary: 'Éxito',
            detail: 'Configuración guardada',
          });
        }
      })
      .catch((reason) => {
        console.error(reason);
        this.toast.error({
          summary: 'Error',
          detail: 'Ocurrió un error al intentar guardar la configuración',
        });
      })
      .finally(() => {
        this.saving = false;
      });
  }

  async updateCalcHours() {
    let totalHours = 0;
    this.activitiesExpert = [];
    this.activitiesTeamCoach = [];
    for (const configActivity of this.showActivityConfig) {
      totalHours += configActivity.limit;
      if (configActivity.expertFocus)
        this.activitiesExpert.push(configActivity);
      if (configActivity.teamCoachFocus)
        this.activitiesTeamCoach.push(configActivity);
    }
    this.showActivityConfig = [...this.showActivityConfig];
    this.activitiesExpert = [...this.activitiesExpert];
    this.activitiesTeamCoach = [...this.activitiesTeamCoach];
    this.activitiesConfig.limit = totalHours;
  }

  updateStartupsAssign(): IAssign[] {
    const ans: IAssign[] = [];
    for (const activity of this.showActivityConfig) {
      for (const startup of this.listStartups) {
        const config = this.service.configOrChangeStartup(
          activity,
          startup,
          this.activitiesConfig,
          this.changesStartups
        );
        if (config) ans.push(config);
      }
    }
    return ans;
  }

  updateExpertAssign(): IAssign[] {
    const ans: IAssign[] = [];
    for (const activity of this.activitiesExpert) {
      for (const expert of this.listExperts) {
        const config = this.service.configOrChangeEntity(
          activity,
          expert,
          this.activitiesConfig,
          this.changesExperts,
          'experts'
        );
        if (config) ans.push(config);
      }
    }
    return ans;
  }

  updateTeamCoachAssign(): IAssign[] {
    const ans: IAssign[] = [];
    for (const activity of this.activitiesTeamCoach) {
      for (const teamCoach of this.listTeamCoaches) {
        const config = this.service.configOrChangeEntity(
          activity,
          teamCoach,
          this.activitiesConfig,
          this.changesTeamCoaches,
          'teamCoaches'
        );
        if (config) ans.push(config);
      }
    }
    return ans;
  }
}
