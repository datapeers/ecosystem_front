import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { ToastService } from '@shared/services/toast.service';
import { PhaseHourConfigService } from './phase-hour-config.service';
import { Subscription, first, firstValueFrom, filter } from 'rxjs';
import { Phase } from '../model/phase.model';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { ActivitiesConfig, IAssignItem } from '../model/activities.model';
import { PhaseEventsService } from '../phase-events/phase-events.service';
import { TypeEvent } from '../model/events.model';
import { User } from '@auth/models/user';
import { Permission } from '@auth/models/permissions.enum';
import { PhaseExpertsService } from '../phase-experts/phase-experts.service';
import { PhaseStartupsService } from '../phase-startups/phase-startups.service';
import { UserService } from '@auth/user.service';

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
  showActivityConfig = [];
  user: User;

  idActivityTeamCoaches = '646f953cc2305c411d73f700';
  teamCoachActivityIndex;

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
      this.showActivityConfig = [];
      let index = 0;
      for (const iterator of this.typesActivities) {
        const prevConfig = this.activitiesConfig.activities.find(
          (i) => i.idActivity === iterator._id
        );
        const configActivity = {
          idActivity: iterator._id,
          limit: 0,
          options: {},
          ...prevConfig,
          activityName: iterator.name,
        };
        delete configActivity['__typename'];
        this.showActivityConfig.push(configActivity);
        if (configActivity.idActivity === this.idActivityTeamCoaches)
          this.teamCoachActivityIndex = index;
        index++;
      }
      this.loaded = true;
    });
  }

  saveConfig() {
    this.saving = true;
    this.updateConfig();
  }

  async updateConfig() {
    let hoursExpert = 0;
    this.activitiesConfig.calcHoursExperts.list.forEach(
      (i) => (hoursExpert += i.limit)
    );
    if (
      this.hoursStartupsInvalid(this.activitiesConfig.calcHoursExperts.list)
    ) {
      this.toast.alert({
        summary: 'Configuración inválida',
        detail:
          'La cantidad de horas asignadas a las startups por experto no coinciden',
        life: 3000,
      });
      return;
    }
    if (
      this.hoursStartupsInvalid(this.activitiesConfig.calcHoursTeamCoaches.list)
    ) {
      this.toast.alert({
        summary: 'Configuración inválida',
        detail:
          'La cantidad de horas asignadas a las startups por team coach no coinciden',
        life: 3000,
      });
      return;
    }
    this.service
      .updateConfig(this.activitiesConfig._id, {
        activities: this.showActivityConfig.map((i) => {
          delete i['activityName'];
          return i;
        }),
        experts: this.activitiesConfig.experts,
        teamCoaches: this.activitiesConfig.teamCoaches,
        startups: this.activitiesConfig.startups,
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
    let hoursTeamCoaches = 0;
    let totalHours = 0;
    for (const configActivity of this.showActivityConfig) {
      totalHours += configActivity.limit;
      if (configActivity.idActivity === this.idActivityTeamCoaches)
        hoursTeamCoaches = configActivity.limit;
    }
    this.activitiesConfig.limit = totalHours;
  }

  hoursStartupsInvalid(list: IAssignItem[]) {
    for (const iterator of list) {
      const limit = iterator.limit;
      let countHoursStartups = 0;
      for (const startup of iterator.to) {
        const previousConfig = this.activitiesConfig.startups.find(
          (i) => i.id === startup.id && i.from === iterator.from
        );
        countHoursStartups += previousConfig
          ? previousConfig.limit
          : startup.limit;
      }
      if (limit < countHoursStartups) {
        return true;
      }
    }
    return false;
  }
}
