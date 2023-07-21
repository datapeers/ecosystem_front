import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  ActivitiesConfig,
  IAssignHoursConfig,
  IAssignItem,
} from '@home/phases/model/activities.model';

@Component({
  selector: 'app-assign-hours',
  templateUrl: './assign-hours.component.html',
  styleUrls: ['./assign-hours.component.scss'],
})
export class AssignHoursComponent implements OnInit, OnChanges {
  @Input() activitiesConfig: ActivitiesConfig = null;
  @Input() property: string = '';

  @Input() assignedHours = 0;
  @Input() limit: number = 0;
  @Input() list: IAssignItem[] = [];
  globalHours = 0;
  hoursOneByOne = 0;

  ngOnInit() {
    const hoursTotalFrom = this.list.map((i) => i.limit);
    this.globalHours = hoursTotalFrom.reduce((ac, cv) => ac + cv, 0);
    this.hoursOneByOne = this.assignedHours;
  }

  ngOnChanges() {
    this.updateCalcHours();
  }

  setVars() {
    this.hoursOneByOne = 0;
    this.globalHours = 0;
  }

  loadItems() {
    this.setVars();
  }

  updateCalcHours() {
    let index = 0;
    const pendingIndexItems = [];
    const previousHoursOneByOne = this.hoursOneByOne;
    this.setVars();
    for (const iterator of this.list) {
      if (iterator.limit === previousHoursOneByOne) {
        pendingIndexItems.push(index);
      } else {
        this.globalHours += iterator.limit;
      }
      index++;
    }
    if (pendingIndexItems.length !== 0) {
      this.hoursOneByOne = Math.round(
        (this.limit - this.globalHours) / pendingIndexItems.length
      );
      for (const iterator of pendingIndexItems) {
        this.list[iterator].limit = this.hoursOneByOne;
        this.globalHours += this.hoursOneByOne;
      }
    }
    this.activitiesConfig[this.property] = [];
    index = 0;
    for (const iterator of this.list) {
      if (!pendingIndexItems.includes(index))
        this.activitiesConfig[this.property].push({
          from: iterator.from,
          limit: iterator.limit,
          to: [],
        });
      index++;
    }
  }
}
