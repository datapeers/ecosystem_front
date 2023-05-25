import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { ToastService } from '@shared/services/toast.service';
import { PhaseHourConfigService } from './phase-hour-config.service';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { Phase } from '../model/phase.model';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import {
  ActivitiesConfig,
} from '../model/activities.model';
import { PhaseEventsService } from '../phase-events/phase-events.service';
import { TypeEvent } from '../model/events.model';

@Component({
  selector: 'app-phase-hours-config',
  templateUrl: './phase-hours-config.component.html',
  styleUrls: ['./phase-hours-config.component.scss'],
})
export class PhaseHoursConfigComponent implements OnInit, OnDestroy {
  loaded = false;
  limitRanges: number = 3;
  saving: boolean = false;

  showActivityDialog: boolean = false;
  selectedActivity;

  leftActivities;
  activitiesConfig: ActivitiesConfig;
  watchConfig$: Subscription;
  typesEvent$: Subscription;
  phase: Phase;
  typesActivities: TypeEvent[];
  showActivityConfig = [];
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: PhaseHourConfigService,
    private readonly activitiesTypesService: PhaseEventsService,
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.watchConfig$?.unsubscribe();
    this.typesEvent$?.unsubscribe();
  }

  async loadComponent() {
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );
    this.typesActivities = await this.activitiesTypesService.getTypesEvents();
    this.watchConfig$ = (
      await this.service.watchConfig(this.phase._id)
    ).subscribe((i) => {
      this.loaded = false;
      this.activitiesConfig = cloneDeep(i);
      this.showActivityConfig = [];
      for (const iterator of this.typesActivities) {
        const prevConfig = this.activitiesConfig.activities.find(i => i.idActivity === iterator._id);
        this.showActivityConfig.push({
          idActivity: iterator._id,
          limit: 0,
          options: {},
          ...prevConfig,
          activityName: iterator.name
        })
      }
      this.loaded = true;
    });
  }

  saveConfig() {
    this.saving = true;
    this.updateConfig();
  }

  getFixedConfig() {
    return {
      ...this.activitiesConfig,
      phase: this.phase._id,
      availability: this.activitiesConfig.availability.map(({ start, end }) => {
        return {
          start: {
            hour: start.getUTCHours(),
            minute: start.getUTCMinutes(),
          },
          end: {
            hour: end.getUTCHours(),
            minute: end.getUTCMinutes(),
          },
        };
      }),
    };
  }

  async updateConfig() {
    const fixedConfig = this.getFixedConfig();
    this.service
      .updateConfig(this.activitiesConfig._id, fixedConfig)
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
  
}