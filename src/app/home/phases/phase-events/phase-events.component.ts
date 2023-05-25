import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { PhaseEventsService } from './phase-events.service';
import { TypeEvent } from '../model/events.model';
import { cloneDeep } from '@apollo/client/utilities';

@Component({
  selector: 'app-phase-events',
  templateUrl: './phase-events.component.html',
  styleUrls: ['./phase-events.component.scss'],
})
export class PhaseEventsComponent implements OnInit, OnDestroy {
  loaded = false;
  showTypes = false;
  typesEvents: TypeEvent[] = [];
  showedTypesEvents: { [s: string]: TypeEvent } = {};
  clonedTypesEvents: { [s: string]: TypeEvent } = {};
  constructor(
    private readonly toast: ToastService,
    private service: PhaseEventsService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  loadComponent() {
    this.loaded = true;
  }

  openTypes() {
    this.showTypes = true;
  }

  createTypeEvent() {
    this.toast.info({ detail: '', summary: 'Creando' });
    this.service
      .createTypesEvent({
        label: 'new',
        name: 'stage nae',
        color: '#C54927',
      })
      .then((ans) => {
        this.toast.clear();
      })
      .catch(console.warn);
  }

  onTypeEventEditInit(stage: TypeEvent) {
    this.clonedTypesEvents[stage._id] = cloneDeep(stage);
  }

  onTypeEventEditSave(typeEventToEdit: TypeEvent, index: number) {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateTypeEvent(typeEventToEdit.toSave())
      .then((ans) => {
        this.toast.clear();
        this.typesEvents[index] = typeEventToEdit;
        this.toast.success({
          detail: 'La etapa se edito exitosamente',
          summary: 'Etapa editada!',
          life: 2000,
        });
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar etapa',
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
}
