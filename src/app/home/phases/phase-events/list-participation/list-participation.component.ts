import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Event, IEntityEvent, IItemStartup } from '../models/events.model';
import { ParticipationEvent } from '../models/participation.model';
import { Table } from 'primeng/table';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '@shared/services/toast.service';
import { User } from '@auth/models/user';
import { PhaseStartupsService } from '@home/phases/phase-startups/phase-startups.service';
import { PhaseEventsService } from '../phase-events.service';
@Component({
  selector: 'app-list-participation',
  templateUrl: './list-participation.component.html',
  styleUrls: ['./list-participation.component.scss'],
})
export class ListParticipationComponent implements OnInit {
  loaded = false;
  event: Event;
  user: User;
  list: ParticipationEvent[] = [];
  startupsList: IItemStartup[] = [];
  entrepreneurList: IEntityEvent[] = [];

  // ? Table
  filterFields = ['participantName', 'startupName', 'rating'];
  header: Element;
  footer: Element;
  scrollHeight;
  @ViewChild('dt', { static: true }) dt: Table;
  @HostListener('window:fullscreenchange', ['$event'])
  screenChange(event) {
    this.validateHeight();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.validateHeight();
  }

  constructor(
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private toast: ToastService,
    private service: PhaseEventsService,
    private readonly phaseStartupsService: PhaseStartupsService
  ) {
    this.validateHeight();
  }

  async ngOnInit() {
    this.loaded = false;
    this.event = this.config.data.event;
    this.user = this.config.data.user;
    if (!this.event) this.close();
    await this.loadStartUps();
    this.setTable();
    this.loaded = true;
  }

  close() {
    this.ref.close();
  }

  validateHeight() {
    let availableHeight: number;
    availableHeight = window.outerHeight - 200;
    availableHeight -= this.header ? this.header.scrollHeight : 0;
    availableHeight -= this.footer ? this.footer.scrollHeight : 0;
    const tabViewHeight = 50;
    const finalHeight = availableHeight - tabViewHeight;
    const minHeight = 300;
    const height = Math.max(finalHeight, minHeight);
    this.scrollHeight = `${height}px`;
  }

  async loadStartUps() {
    const startupsPhase = await this.phaseStartupsService.getDocuments({
      phase: this.event.batch,
    });
    this.entrepreneurList = [];
    this.startupsList = [];
    for (const startUp of startupsPhase) {
      this.startupsList.push({
        _id: startUp._id,
        name: startUp.item.nombre,
        entrepreneurs: startUp.entrepreneurs.map((entrepreneur) => {
          return {
            _id: entrepreneur._id,
            name: entrepreneur.item.nombre,
            email: entrepreneur.item.email,
          };
        }),
      });
      for (const entrepreneur of startUp.entrepreneurs) {
        this.entrepreneurList.push({
          _id: entrepreneur._id,
          name: entrepreneur.item.nombre,
          email: entrepreneur.item.email,
        });
      }
    }
  }

  async setTable() {
    const list = await this.service.getParticipationByEvent(this.event._id);
    this.list = [];
    for (const iterator of list) {
      this.list.push(
        ParticipationEvent.fromJSON(iterator, this.event, this.startupsList)
      );
    }
  }
}
