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
} from '../model/activities.model';
import { PhaseEventsService } from '../phase-events/phase-events.service';
import { TypeEvent } from '../model/events.model';
import { User } from '@auth/models/user';
import { Permission } from '@auth/models/permissions.enum';

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
  activitiesExpert: IActivityConfigInput[] = [];

  idTeamCoachActivities = ['646f953cc2305c411d73f700'];
  activitiesTeamCoach: IActivityConfigInput[] = [];
  public get userPermission(): typeof Permission {
    return Permission;
  }

  constructor(
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
      console.log(this.activitiesConfig);

      // Lists
      this.listStartups = this.activitiesConfig.calcHours.hoursAssignStartups;
      this.listExperts = this.activitiesConfig.calcHours.hoursAssignExperts;

      // Vars
      let index = 0;
      this.showActivityConfig = [];
      this.activitiesExpert = [];
      this.activitiesTeamCoach = [];
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

      // Changes
      this.changesStartups = [];
      this.changesExperts = [];

      this.loaded = true;
    });
  }

  saveConfig() {
    this.saving = true;
    this.updateConfig();
  }

  async updateConfig() {
    this.service
      .updateConfig(this.activitiesConfig._id, {
        activities: this.showActivityConfig.map((i) => {
          delete i['activityName'];
          return i;
        }),
        experts: this.activitiesConfig.experts,
        teamCoaches: this.activitiesConfig.teamCoaches,
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
        const config = this.service.configOrChange(
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
}
