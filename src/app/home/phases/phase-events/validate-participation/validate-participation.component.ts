import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { first, firstValueFrom } from 'rxjs';
import { SeverityMessages } from '@shared/models/severity.enum';
import { Event } from '../models/events.model';
import { PhaseEventsService } from '../phase-events.service';
import { Startup } from '@shared/models/entities/startup';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { Message } from 'primeng/api';
import * as moment from 'moment';
import {
  ParticipationEvent,
  IParticipationEvent,
} from '../models/participation.model';

@Component({
  selector: 'app-validate-participation',
  templateUrl: './validate-participation.component.html',
  styleUrls: ['./validate-participation.component.scss'],
})
export class ValidateParticipationComponent implements OnInit, OnDestroy {
  loaded = false;
  user: User;
  event: Event;
  profileDoc;
  startup: Startup;
  messages: Message[] = [];
  participation: ParticipationEvent;

  constructor(
    private toast: ToastService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private service: PhaseEventsService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {}

  async loadComponent() {
    this.user = await firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    );

    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    console.log(this.profileDoc);
    this.startup = this.profileDoc.startups[0];
    if (!this.checksUser()) return;
    const pathUrl = await firstValueFrom(this.route.url);
    const idEvent = pathUrl[1]?.path;
    if (!this.checksBasic(idEvent)) return;
    this.event = await this.service.getEvent(idEvent);
    if (!this.checksEvent(this.event)) return;

    const participation = await this.service.getParticipation(
      this.event._id,
      this.profileDoc._id
    );
    if (participation) {
      this.messages = [
        {
          severity: SeverityMessages.success,
          summary: '¡Ya has marcado asistencia!',
          detail: 'Ya has registrado tu asistencia para este evento.',
        },
      ];
      return;
    }
    this.toast.info({
      summary: 'Marcando asistencia',
      detail: 'Se esta registrando tu asistencia al evento, espera un momento',
      life: 45000,
    });
    this.service
      .markParticipation(
        this.event._id,
        this.profileDoc._id,
        this.startup._id,
        {
          userId: this.user._id,
          email: this.user.email,
          userAgent: window.navigator.userAgent,
        }
      )
      .catch((err) => {
        this.toast.error({
          summary: 'Error al marcar asistencia',
          detail: err,
          life: 45000,
        });
        return;
      })
      .then((doc: IParticipationEvent) => {
        if (!doc) return;
        this.toast.clear();
        this.messages = [
          {
            severity: SeverityMessages.success,
            summary: '¡Asistencia al evento marcada!',
            detail:
              'Has marcado exitosamente tu asistencia en el evento. Puedes cerrar la ventana.',
          },
        ];
        return;
      });
  }

  loadEvent() {
    // this.service.getEvent();
  }

  checksBasic(idEvent): boolean {
    // ? if url invalid
    if (!idEvent) {
      this.messages = [
        {
          severity: SeverityMessages.error,
          summary: '¡Enlace inválido!',
          detail: 'El enlace con el que ingresaste es inválido.',
        },
      ];
      return false;
    }
    return true;
  }

  checksUser(): boolean {
    // ? if user invalid
    if (!this.user.isUser) {
      this.messages = [
        {
          severity: SeverityMessages.warn,
          summary: 'Rol inválido',
          detail: `No es necesario marcar la participación para un usuario con rol ${this.user.rolName}.`,
        },
      ];
      return false;
    }
    return true;
  }

  checksEvent(event): boolean {
    if (!this.event) {
      this.messages = [
        {
          severity: SeverityMessages.error,
          summary: '¡Evento no encontrado!',
          detail:
            'No se ha encontrado el evento. Por favor, revisa la URL o comunícate con un administrador.',
        },
      ];
      return false;
    }
    this.event = Event.fromJson(this.event);
    if (moment(this.event.startAt).isAfter(new Date())) {
      this.messages = [
        {
          severity: SeverityMessages.warn,
          summary: '¡El evento aún no ha comenzado!',
          detail:
            'No es posible marcar la asistencia ya que el evento aún no ha comenzado.',
        },
      ];
      return false;
    }
    if (moment(this.event.endAt).isBefore(new Date())) {
      this.messages = [
        {
          severity: SeverityMessages.warn,
          summary: '¡El evento ya ha terminado!',
          detail:
            'No es posible marcar la asistencia ya que el evento ha finalizado.',
        },
      ];
      return false;
    }
    if (!this.event.participants.find((i) => i._id === this.profileDoc._id)) {
      this.messages = [
        {
          severity: SeverityMessages.warn,
          summary: 'No apareces como participante en este evento',
          detail:
            'No es posible marcar la asistencia, ya que no has sido invitado a este evento.',
        },
      ];
      return false;
    }
    return true;
  }
}
