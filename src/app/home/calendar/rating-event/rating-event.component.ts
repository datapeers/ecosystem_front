import { Component, OnInit } from '@angular/core';
import { User } from '@auth/models/user';
import { Event } from '@home/phases/phase-events/models/events.model';
import {
  IParticipationEvent,
  ParticipationEvent,
} from '@home/phases/phase-events/models/participation.model';
import { PhaseEventsService } from '@home/phases/phase-events/phase-events.service';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-rating-event',
  templateUrl: './rating-event.component.html',
  styleUrls: ['./rating-event.component.scss'],
})
export class RatingEventComponent implements OnInit {
  loaded: boolean = false;
  event: Event;
  user: User;
  profileDoc;
  rating: number;
  saving = false;
  participation: IParticipationEvent;
  constructor(
    private readonly eventService: PhaseEventsService,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  async loadComponent() {
    this.loaded = false;
    this.event = this.config.data.event;
    this.user = this.config.data.user;
    this.profileDoc = this.config.data.profileDoc;
    this.participation = await this.eventService.getParticipation(
      this.event._id,
      this.profileDoc._id
    );
    if (!this.participation) {
      this.toast.alert({
        summary: 'No participaste en el evento',
        detail: 'No puedes calificar el evento, debido a que no participaste',
        life: 12000,
      });
      this.close();
      return;
    }
    this.rating = this.participation.metadata?.rating;
    this.loaded = true;
  }

  async ratingChange() {
    this.saving = true;
    this.toast.clear();
    await this.eventService.updateParticipation(this.participation._id, {
      ...this.participation.metadata,
      rating: this.rating,
    });
    this.toast.info({ detail: '', summary: 'Evento calificado' });
    this.saving = false;
  }

  close() {
    this.ref.close();
  }
}
