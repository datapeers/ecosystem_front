import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { ToastService } from '@shared/services/toast.service';
import { PhaseHourConfigService } from './phase-hour-config.service';
import { Subscription, first, firstValueFrom, filter } from 'rxjs';
import { Phase } from '../model/phase.model';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { ActivitiesConfig } from '../model/activities.model';
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
  totalActivities = 0;
  user: User;

  expertsHours = 0;
  assignedHoursExpert = 0;

  teamCoachesHours = 0;
  assignedHoursTeamCoaches = 0;

  idActivityTeamCoaches = '646f953cc2305c411d73f700';
  teamCoachActivityIndex;

  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly userService: UserService,
    private readonly service: PhaseHourConfigService,
    private readonly expertsService: PhaseExpertsService,
    private readonly phaseStartupsService: PhaseStartupsService,
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

    /// console.log(this.typesActivities);
    this.watchConfig$ = (
      await this.service.watchConfig(this.phase._id)
    ).subscribe(async (i) => {
      this.loaded = false;
      this.activitiesConfig = cloneDeep(i);
      this.showActivityConfig = [];
      this.totalActivities = 0;
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
        this.totalActivities += configActivity.limit;
        index++;
      }

      // Set for Expert page
      this.expertsHours = this.activitiesConfig.calcHoursExperts.expertHours;
      this.assignedHoursExpert =
        this.activitiesConfig.calcHoursExperts.hoursLeftToOthersExperts;
      this.loaded = true;
    });
  }

  saveConfig() {
    this.saving = true;
    this.updateConfig();
  }

  async updateConfig() {
    console.log(cloneDeep(this.activitiesConfig));
    if (this.activitiesConfig.limit - this.totalActivities < 0) {
      this.toast.alert({
        summary: 'Configuración inválida',
        detail:
          'La cantidad de horas asignadas a las actividades supera el límite total de horas permitidas para esta fase',
        life: 3000,
      });
      return;
    }

    let hoursExpert = 0;
    this.activitiesConfig.calcHoursExperts.list.forEach(
      (i) => (hoursExpert += i.limit)
    );
    if (this.expertsHours - hoursExpert < 0) {
      this.toast.alert({
        summary: 'Configuración inválida',
        detail:
          'La cantidad de horas asignadas entre los expertos no coincide con el numero de horas de las actividades',
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
    this.totalActivities = 0;
    let hoursTeamCoaches = 0;
    for (const configActivity of this.showActivityConfig) {
      this.totalActivities += configActivity.limit;
      if (configActivity.idActivity === this.idActivityTeamCoaches)
        hoursTeamCoaches = configActivity.limit;
    }
    this.expertsHours = this.totalActivities - hoursTeamCoaches;
  }
}
