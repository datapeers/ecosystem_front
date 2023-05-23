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
  activitiesTypesArray,
} from '../model/activities.model';

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
  availableRanges: DateRange<Date>[];
  activities: { label: string; value: string }[] = [];
  activitiesObj: Record<string, string> = {};
  watchConfig$: Subscription;
  phase: Phase;
  constructor(
    private store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly service: PhaseHourConfigService
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
    this.watchConfig$ = (
      await this.service.watchConfig(this.phase._id)
    ).subscribe((i) => {
      this.loaded = false;
      this.activities = activitiesTypesArray;
      this.activitiesConfig = cloneDeep(i);
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

  addActivity() {
    this.activitiesConfig.availability.push({
      idActivity: this.selectedActivity.value,
      limit: 5,
    });
    this.showActivityDialog = false;
  }

  openDialog() {
    if (this.activitiesConfig.availability.length >= this.activities.length) {
      this.toast.alert({
        summary: 'Todas las actividades son agendables',
        detail:
          'Todas las actividades de la institución se encuentran configuradas como agendables en esta fase',
      });
      return;
    }
    this.leftActivities = this.activities.filter(
      (a) =>
        !this.activitiesConfig.activities.some(
          (act) => act.idActivity === a.value
        )
    );
    this.showActivityDialog = true;
  }

  addRange() {
    const ranges = this.activitiesConfig.availability;
    // if (this.rangesOverlap(ranges)) {
    //   return;
    // }
    if (!ranges.every(this.isValidRange)) {
      return;
    }
    if (ranges.length === this.limitRanges) {
      this.toast.alert({
        summary: 'Limite de rangos',
        detail:
          'No se pueden agregar mas rangos de disponibilidad a la configuración',
      });
      return;
    }
    let now: Date;
    if (ranges.length === 0) {
      now = new Date();
    } else {
      now = new Date(ranges[ranges.length - 1].end.getTime());
      now.setHours(now.getHours() + 1);
    }
    now.setMinutes(0, 0, 0);
    const later = new Date(now.getTime());
    later.setHours(later.getHours() + 1);
    this.activitiesConfig.availability.push({
      start: now,
      end: later,
    });
  }

  isValidRange(range: DateRange<Date>): boolean {
    return range.start.getTime() <= range.end.getTime();
  }

  rangesOverlap(ranges: DateRange<Date>[]): boolean {
    return ranges.some((range, i, arr) => {
      return arr.some((someRange, j) => {
        if (j === i) {
          return false;
        }
        const endOverlap =
          range.end.getTime() < someRange.end.getTime() &&
          range.end.getTime() > someRange.start.getTime();
        const startOverlap =
          range.start.getTime() < someRange.end.getTime() &&
          range.start.getTime() > someRange.start.getTime();
        return endOverlap || startOverlap;
      });
    });
  }
}

type ActivityConfig = {
  idActividad?: string;
  limit?: number;
};

type DateRange<T> = {
  start: T;
  end: T;
};

type TimeOfDay = {
  hour: number;
  minute: number;
};
