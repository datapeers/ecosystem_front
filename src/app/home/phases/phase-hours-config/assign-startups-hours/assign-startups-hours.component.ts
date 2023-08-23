import {
  Component,
  ViewChild,
  Input,
  HostListener,
  OnChanges,
} from '@angular/core';
import {
  ActivitiesConfig,
  IActivityConfigInput,
  IAssign,
} from '@home/phases/model/activities.model';
import { Table } from 'primeng/table';
import { PhaseHourConfigService } from '../phase-hour-config.service';
import { IConfigStartup } from '../models/config-startup';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-assign-startups-hours',
  templateUrl: './assign-startups-hours.component.html',
  styleUrls: ['./assign-startups-hours.component.scss'],
})
export class AssignStartupsHoursComponent implements OnChanges {
  // Inputs component
  @Input() config: ActivitiesConfig;
  @Input() listStartups: IConfigStartup[];
  @Input() activitiesConfig: IActivityConfigInput[];
  @Input() changes: IAssign[] = []; // Variable for notice when assign hours change
  // Table vars
  scrollHeight;
  @ViewChild('dt', { static: true }) dt: Table;
  header: Element;
  footer: Element;
  page: number = 0;
  @HostListener('window:fullscreenchange', ['$event'])
  screenChange(event) {
    this.validateHeight();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.validateHeight();
  }

  // Vars
  flagsActivity: Message[] = [];
  filterFields = ['item.nombre'];
  constructor(private service: PhaseHourConfigService) {
    this.validateHeight();
  }

  ngOnChanges() {
    this.updateAllValues();
  }

  validateHeight() {
    let availableHeight: number;
    availableHeight = window.outerHeight - 440;
    availableHeight -= this.header ? this.header.scrollHeight : 0;
    availableHeight -= this.footer ? this.footer.scrollHeight : 0;
    const tabViewHeight = 50;
    const finalHeight = availableHeight - tabViewHeight;
    const minHeight = 300;
    const height = Math.max(finalHeight, minHeight);
    this.scrollHeight = `${height}px`;
  }

  updateAllValues() {
    for (const iterator of this.activitiesConfig) {
      this.updateValuesActivity(iterator);
    }
  }

  updateValuesActivity(activity: IActivityConfigInput, item?: IConfigStartup) {
    let limitHours = activity.limit;
    let totalHours = 0;
    let startupsWithoutAssign = [];
    for (const startupConfig of this.listStartups) {
      const previousConfig = this.service.configOrChangeStartup(
        activity,
        startupConfig,
        this.config,
        this.changes
      );
      if (previousConfig) {
        limitHours -= previousConfig.limit;
        totalHours += previousConfig.limit;
      } else {
        if (startupConfig._id === item?._id) {
          limitHours -= item.hours[activity.id];
          totalHours += item.hours[activity.id];
          this.changes.push({
            entityID: item._id,
            activityID: activity.id,
            limit: item.hours[activity.id],
          });
        } else {
          startupsWithoutAssign.push(startupConfig._id);
        }
      }
    }
    let divisionHoursNow = startupsWithoutAssign.length
      ? this.service.getHoursForOthers(limitHours, startupsWithoutAssign.length)
      : 0;
    if (limitHours < 0) divisionHoursNow = 0;
    for (const startup of this.listStartups) {
      if (startupsWithoutAssign.includes(startup._id)) {
        if (limitHours === 0) divisionHoursNow = 0;
        limitHours -= divisionHoursNow;
        startup.hours[activity.id] = divisionHoursNow;
        totalHours += divisionHoursNow;
      }
    }
    this.flagsAlert(activity, limitHours);
  }

  flagsAlert(activity: IActivityConfigInput, hoursCount: number) {
    if (hoursCount < 0) {
      const indexFlag = this.flagsActivity.findIndex(
        (i) => i.id === activity.id
      );
      if (indexFlag === -1) {
        this.flagsActivity.push({
          severity: 'warn',
          summary: 'Error:',
          detail: `Se ha excedido el límite de horas asignadas para la actividad '${
            activity.activityName
          }'. La asignación actual excede dicho límite en ${Math.abs(
            hoursCount
          )} hora(s).`,
          id: activity.id,
        });
      } else {
        this.flagsActivity[
          indexFlag
        ].detail = `Se ha excedido el límite de horas asignadas para la actividad '${
          activity.activityName
        }'. La asignación actual excede dicho límite en ${Math.abs(
          hoursCount
        )} hora(s).`;
      }
    } else {
      this.flagsActivity = this.flagsActivity.filter(
        (i) => i.id !== activity.id
      );
    }
    this.flagsActivity = [...this.flagsActivity];
  }
}
