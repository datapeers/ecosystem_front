import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { PhaseEventsService } from './phase-events.service';
import { TypeEvent } from '../model/events.model';
import { cloneDeep } from '@apollo/client/utilities';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-phase-events',
  templateUrl: './phase-events.component.html',
  styleUrls: ['./phase-events.component.scss'],
})
export class PhaseEventsComponent implements OnInit, OnDestroy {
  loaded = false;
  showTypes = false;
  showCreatorType = false;
  newTypeEvent = TypeEvent.newEventType();
  typesEvents: TypeEvent[] = [];
  showedTypesEvents: { [s: string]: TypeEvent } = {};
  clonedTypesEvents: { [s: string]: TypeEvent } = {};
  typesEvent$: Subscription;

  showCreatorEvent = false;
  constructor(
    private readonly toast: ToastService,
    private service: PhaseEventsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.typesEvent$?.unsubscribe();
  }

  loadComponent() {
    this.loaded = true;
    this.service
      .watchTypesEvents()
      .then((typesEvent$) => {
        this.typesEvent$ = typesEvent$.subscribe(
          (typeEventList: TypeEvent[]) => {
            this.typesEvents = typeEventList.filter((x) => !x.isDeleted);
            // console.log(this.typesEvents);
            for (const iterator of this.typesEvents)
              this.showedTypesEvents[iterator._id] = iterator;
          }
        );
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar tipo de eventos',
          detail: err,
          life: 12000,
        });
        this.typesEvents = [];
      });
  }

  openTypes() {
    this.showTypes = true;
  }

  resetCreatorEventType() {
    this.showCreatorType = false;
    this.newTypeEvent = TypeEvent.newEventType();
  }

  createTypeEvent() {
    this.toast.info({ detail: '', summary: 'Creando' });
    this.service
      .createTypesEvent(this.newTypeEvent)
      .then((ans) => {
        this.toast.clear();
        this.resetCreatorEventType();
      })
      .catch(console.warn);
  }

  onTypeEventEditInit(typeEvent: TypeEvent) {
    this.clonedTypesEvents[typeEvent._id] = cloneDeep(typeEvent);
  }

  onTypeEventEditSave(typeEventToEdit: TypeEvent, index: number) {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateTypeEvent(typeEventToEdit.toSave())
      .then((ans) => {
        this.toast.clear();
        this.typesEvents[index] = typeEventToEdit;
        this.toast.success({
          detail: 'El tipo de evento ha sido editado exitosamente',
          summary: 'Tipo de evento editado!',
          life: 2000,
        });
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar tipo de evento',
          detail: err,
          life: 12000,
        });
        this.onTypeEventEditCancel(typeEventToEdit, index);
      });
  }

  onTypeEventEditCancel(typeEvent: TypeEvent, index: number) {
    this.typesEvents[index] = this.clonedTypesEvents[typeEvent._id];
    delete this.clonedTypesEvents[typeEvent._id];
  }

  deleteType(typeEventToEdit: TypeEvent, index: number) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere continuar?',
      message:
        'Al eliminar este tipo de evento, se limitará únicamente la creación de eventos futuros, mientras que los eventos pasados se conservarán tal como están. ¿Está seguro de que desea eliminar este tipo de evento?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteTypeEvent(typeEventToEdit._id)
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'El tipo de evento ha sido eliminado exitosamente',
              summary: 'Tipo de evento eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar tipo de evento',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  resetCreatorEvent() {
    this.showCreatorEvent = false;
    this.newTypeEvent = TypeEvent.newEventType();
  }
}
