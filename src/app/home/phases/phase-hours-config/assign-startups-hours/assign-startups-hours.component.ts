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
} from '@home/phases/model/activities.model';
import { Table } from 'primeng/table';
import { PhaseHourConfigService } from '../phase-hour-config.service';

@Component({
  selector: 'app-assign-startups-hours',
  templateUrl: './assign-startups-hours.component.html',
  styleUrls: ['./assign-startups-hours.component.scss'],
})
export class AssignStartupsHoursComponent implements OnChanges {
  // Inputs component
  @Input() config: ActivitiesConfig = null;
  @Input() listStartups = [];
  @Input() activitiesConfig: IActivityConfig[] = [];
  @Input() changes = [];
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

  // Vars to calculate

  constructor(private service: PhaseHourConfigService) {
    this.validateHeight();
  }

  ngOnChanges() {
    console.log(this.listStartups);
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

  updateValuesActivity(activity: IActivityConfig, item?) {
    let limitHours = activity.limit;
    let startupsWithoutAssign = [];
    for (const startupConfig of this.listStartups) {
      const previousConfig = this.config.startups.find(
        (i) => i.id === startupConfig._id
      );
      if (previousConfig) {
        limitHours -= previousConfig.limit;
      } else {
        if (startupConfig._id === item?._id) {
          limitHours -= item.limit;
          continue;
        }
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
        startup.limit = divisionHoursNow;
      }
    }
    if (item) {
      const previousConfig = this.config.startups.find(
        (i) => i.id === item._id
      );
      const previousChange = this.changes.find((i) => i._id === item._id);
      if (!previousConfig && !previousChange) this.changes.push(item);
      if (previousConfig && previousConfig.limit !== item.limit)
        this.changes.push(item);
    }
  }
}
