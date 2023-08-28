import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivitiesConfig,
  IActivityConfigInput,
  IAssign,
} from '@home/phases/phase-hours-config/models/activities.model';
import { IConfigExpert, IConfigTeamCoach } from '../models/config-startup';
import { Table } from 'primeng/table';
import { PhaseHourConfigService } from '../phase-hour-config.service';
import { Message } from 'primeng/api';
import { ColumnHour, columnsHours } from '../models/columns-hours.enum';

@Component({
  selector: 'app-assign-hours',
  templateUrl: './assign-hours.component.html',
  styleUrls: ['./assign-hours.component.scss'],
})
export class AssignHoursComponent implements OnChanges {
  // Inputs component
  @Input() config: ActivitiesConfig;
  @Input() list: IConfigExpert[] | IConfigTeamCoach[];
  @Input() activitiesConfig: IActivityConfigInput[];
  @Input() changes: IAssign[] = []; // Variable for notice when assign hours change
  @Input() type: 'experts' | 'teamCoaches';
  @Input() columnsHours: ColumnHour[] = [];
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

  updateValuesActivity(
    activity: IActivityConfigInput,
    config?: { item: IConfigExpert | IConfigTeamCoach; column: ColumnHour }
  ) {
    let limitHours = activity.limit;
    let totalHours = 0;
    for (const entityConfig of this.list) {
      const previousConfig = this.service.configOrChangeEntity(
        activity,
        entityConfig,
        this.config,
        this.changes,
        this.type
      );
      if (previousConfig) {
        limitHours -= previousConfig.limit;
        totalHours += previousConfig.limit;
      } else {
        if (entityConfig._id === config?.item._id) {
          limitHours -= config.item.hours[activity.id][config.column.property];
          totalHours += config.item.hours[activity.id][config.column.property];
          this.changes.push({
            entityID: config.item._id,
            activityID: activity.id,
            limit: config.item.hours[activity.id][config.column.property],
          });
        }
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
