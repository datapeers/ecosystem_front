import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  ActivitiesConfig,
  IAssignHoursConfig,
  IAssignItem,
  IStartupAssign,
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

  previousHoursStartups = {};
  startupsModified = {};

  loading = false;

  ngOnInit() {
    this.loading = true;
    const hoursTotalFrom = this.list.map((i) => i.limit);
    this.globalHours = hoursTotalFrom.reduce((ac, cv) => ac + cv, 0);
    this.hoursOneByOne = this.assignedHours;
    this.setPreviousHoursStartups();
    this.loading = false;
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

  setPreviousHoursStartups() {
    for (const item of this.list) {
      for (const startup of item.to) {
        this.previousHoursStartups[startup.id] = startup.limit;
      }
    }
  }

  updateCalcHours() {
    if (this.loading) return;
    this.loading = true;
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
      if (!pendingIndexItems.includes(index)) {
        this.activitiesConfig[this.property].push({
          from: iterator.from,
          limit: iterator.limit,
          to: [],
        });
      }
      if (iterator.to.length) {
        this.setHoursStartup(iterator);
      }
      index++;
    }
    this.setPreviousHoursStartups();
    this.loading = false;
  }

  setHoursStartup(item: IAssignItem) {
    let limitHoursStartups = item.limit;
    let pendingStartups = [];
    let indexStartup = 0;
    for (const startup of item.to) {
      const previousConfig = this.activitiesConfig.startups.find(
        (i) => i.id === startup.id
      );
      if (
        previousConfig &&
        this.previousHoursStartups[startup.id] === previousConfig.limit
      ) {
        limitHoursStartups -= previousConfig.limit;
      } else {
        if (this.previousHoursStartups[startup.id] !== startup.limit) {
          // this.replaceOrSetStartupHours(startup, item);
          limitHoursStartups -= startup.limit;
        } else {
          pendingStartups.push(indexStartup);
        }
      }
      indexStartup++;
    }
    let hoursForOthersStartups = Math.round(
      limitHoursStartups / pendingStartups.length
    );
    for (const indexPendingStartup of pendingStartups) {
      item.to[indexPendingStartup].limit = hoursForOthersStartups;
    }
  }

  replaceOrSetStartupHours(item: IStartupAssign, parent: IAssignItem) {
    const previousConfig = this.activitiesConfig.startups.find(
      (i) => i.id === item.id && i.from === parent.from
    );
    if (previousConfig) {
      previousConfig.limit = item.limit;
    } else {
      console.log('b');
      this.activitiesConfig.startups.push({
        id: item.id,
        from: parent.from,
        limit: item.limit,
      });
    }
  }
}
