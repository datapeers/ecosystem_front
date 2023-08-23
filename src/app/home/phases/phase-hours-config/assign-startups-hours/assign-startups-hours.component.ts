import {
  Component,
  ViewChild,
  Input,
  ElementRef,
  HostListener,
  OnChanges,
} from '@angular/core';
import {
  ActivitiesConfig,
  IActivityConfig,
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

  constructor(private service: PhaseHourConfigService) {
    this.validateHeight();
  }

  ngOnChanges() {
    // this.updateAllValues();
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

  updateValuesActivity(activity: IActivityConfigInput) {
    console.log(1);
    let limitHours = activity.limit;
    let totalHours = 0;
    let startupsWithoutAssign = [];
    for (const startupConfig of this.listStartups) {
      const previousConfig = this.previousConfig(activity, startupConfig);
      if (previousConfig) {
        limitHours -= previousConfig.limit;
        totalHours += previousConfig.limit;
      } else {
        startupsWithoutAssign.push(startupConfig._id);
      }
    }
    let divisionHoursNow = startupsWithoutAssign.length
      ? this.service.getHoursForOthers(limitHours, startupsWithoutAssign.length)
      : 0;
    for (const startup of this.listStartups) {
      if (startupsWithoutAssign.includes(startup._id)) {
        if (limitHours === 0) divisionHoursNow = 0;
        limitHours -= divisionHoursNow;
        startup.hours[activity.id] = divisionHoursNow;
        totalHours += divisionHoursNow;
      }
    }
    console.log('limite', limitHours, 'calculado', totalHours);
    if (limitHours < totalHours) {
      console.log('here');
      this.flagsActivity.push({
        severity: 'warn',
        summary: 'Error:',
        detail: `Las horas asignadas a la actividad de  ${activity.activityName} supera el limite establecido`,
        id: activity.id,
      });
    } else {
      console.log('limpia bandera');
      this.flagsActivity = this.flagsActivity.filter(
        (i) => i.id === activity.id
      );
    }
    console.log('final');
  }

  previousConfig(
    activity: IActivityConfig,
    startupConfig: IConfigStartup
  ): IAssign {
    const previousConfig = this.config.startups.findIndex(
      (i) => i.id === startupConfig._id && i.activityID === activity.id
    );
    const previousChange = this.changes.findIndex(
      (i) => i.id === startupConfig._id && i.activityID === activity.id
    );
    if (previousChange !== -1) {
      if (
        this.changes[previousChange].limit !== startupConfig.hours[activity.id]
      ) {
        this.changes[previousChange].limit = startupConfig.hours[activity.id];
      }
      return this.changes[previousChange];
    }
    if (previousConfig !== -1) {
      if (
        this.config.startups[previousConfig].limit !==
        startupConfig.hours[activity.id]
      ) {
        this.changes.push({
          id: startupConfig._id,
          limit: startupConfig.hours[activity.id],
          activityID: activity.id,
        });
        return this.changes[this.changes.length - 1];
      }
      return this.config.startups[previousConfig];
    }
    return null;
  }
}
