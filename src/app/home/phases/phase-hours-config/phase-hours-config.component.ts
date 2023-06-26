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
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: PhaseHourConfigService,
    private readonly activitiesTypesService: PhaseEventsService
  ) {}

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
    ).subscribe((i) => {
      this.loaded = false;
      this.activitiesConfig = cloneDeep(i);
      this.showActivityConfig = [];
      this.totalActivities = 0;
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
        this.totalActivities += configActivity.limit;
      }
      this.loaded = true;
    });
  }

  saveConfig() {
    this.saving = true;
    this.updateConfig();
  }

  async updateConfig() {
    if (this.activitiesConfig.limit - this.totalActivities < 0) {
      this.toast.alert({
        summary: 'Configuración inválida',
        detail:
          'La cantidad de horas asignadas a las actividades supera el límite total de horas permitidas para esta fase',
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
    for (const configActivity of this.showActivityConfig) {
      this.totalActivities += configActivity.limit;
    }
  }
}
