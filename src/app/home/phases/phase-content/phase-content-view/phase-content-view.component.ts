import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Location } from '@angular/common';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { PhaseContentService } from '../phase-content.service';
import { Content } from '@home/phases/model/content.model';
import { cloneDeep } from 'lodash';
import { configTinyMce } from '@shared/models/configTinyMce';
import { PhaseContentResourceCreatorComponent } from '../phase-content-resource-creator/phase-content-resource-creator.component';
import { Phase } from '@home/phases/model/phase.model';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { Resource } from '@home/phases/model/resource.model';

@Component({
  selector: 'app-phase-content-view',
  templateUrl: './phase-content-view.component.html',
  styleUrls: ['./phase-content-view.component.scss'],
})
export class PhaseContentViewComponent implements OnInit, OnDestroy {
  faReply = faReply;
  contentID;
  content: Content;
  configTiny = configTinyMce;
  phase: Phase;
  watchContent$: Subscription;
  displayResources = [];
  weight = null;
  forSave;
  saving = false;
  constructor(
    private store: Store<AppState>,
    private routeOpt: ActivatedRoute,
    private _location: Location,
    public dialogService: DialogService,
    private toast: ToastService,
    private confirmationService: ConfirmationService,
    private service: PhaseContentService
  ) {
    this.contentID = this.routeOpt.snapshot.params['idContent'];
  }

  ngOnInit() {
    this.loadContent();
  }

  ngOnDestroy() {
    this.watchContent$?.unsubscribe();
  }

  async loadContent() {
    firstValueFrom(
      this.store.select((i) => i.phase.phase).pipe(first((i) => i !== null))
    ).then((phase) => (this.phase = phase));
    this.watchContent$ = (
      await this.service.watchContent(this.contentID)
    ).subscribe((content) => {
      this.content = cloneDeep(content);
      this.displayResources = this.service.convertResourceToNode(
        this.content.resources,
        this.content
      );
    });
  }

  return() {
    this._location.back();
  }

  saveChanges() {
    this.toast.info({ summary: 'Guardando...', detail: '' });
    this.service
      .updateContent({
        _id: this.content._id,
        content: this.content.content,
        name: this.content.name,
      })
      .then(async () => {
        await this.loadContent();
        this.toast.clear();
        this.toast.info({ summary: 'Cambio guardado', detail: '', life: 2000 });
      })
      .catch((err) => {
        this.failChange(err);
      });
  }

  failChange(err) {
    this.toast.clear();
    // this.cancelEdit(property);
    this.toast.error({ summary: 'Error al guardar cambios', detail: err });
    console.warn(err);
  }

  addResource() {
    const ref = this.dialogService.open(PhaseContentResourceCreatorComponent, {
      header: 'Añadir recurso',
      width: '95vw',
      data: {
        phase: this.phase,
        content: this.content,
        contentID: this.content._id,
        phaseID: this.content.phase,
        onlyView: false,
      },
    });

    ref.onClose.subscribe(async (item) => {
      if (item) {
        await this.loadContent();
        this.toast.clear();
      }
    });
  }

  dialogWeight(rowResource) {
    this.weight = rowResource?.extra_options?.points ?? 100;
    this.forSave = rowResource;
  }

  viewResource(content: Content, resource: Resource) {
    const ref = this.dialogService.open(PhaseContentResourceCreatorComponent, {
      header: resource.name,
      width: '95vw',
      data: {
        phase: this.phase,
        content,
        contentID: this.content._id,
        phaseID: this.content.phase,
        onlyView: true,
        resource,
      },
    });

    ref.onClose.subscribe(async (item) => {
      if (item) {
        await this.loadContent();
        this.toast.clear();
      }
    });
  }

  hideResource(resource: Resource, event) {
    this.confirmationService.confirm({
      key: 'confirmPopup',
      target: event.target,
      acceptLabel: 'Cambiar',
      rejectLabel: 'Cancelar',
      message:
        '¿Está seguro que desea cambiar el estado de visualizar este recurso?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const request = await this.service.updateResource({
          _id: resource._id,
          hide: !resource.hide,
        });
        if (request.hide === !resource.hide) {
          this.toast.info({
            summary: 'Cambio hecho',
            detail: '',
            life: 700,
          });
          resource.hide = !resource.hide;
        } else {
          this.toast.error({
            summary: 'Error',
            detail: 'El cambio no se realizo',
          });
        }
      },
    });
  }

  deleteResource(resource: Resource, event) {
    this.confirmationService.confirm({
      key: 'confirmPopup',
      target: event.target,
      acceptLabel: 'Cambiar',
      rejectLabel: 'Cancelar',
      message: '¿Está seguro que desea eliminar este recurso?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const request = await this.service.updateResource({
          _id: resource._id,
          isDeleted: true,
        });
        if (request) {
          this.toast.info({
            summary: 'Cambio hecho',
            detail: '',
            life: 700,
          });
        } else {
          this.toast.error({
            summary: 'Error',
            detail: 'No se pudo borrar el recurso',
          });
        }
      },
    });
  }

  changeWeight() {
    this.toast.info({ detail: '', summary: 'Guardando cambios' });
    this.saving = true;
    const resourceEdited = {
      _id: this.forSave._id,
      extra_options: { ...this.forSave.extra_options, options: this.weight },
    };
    this.service
      .updateResource({ _id: this.forSave._id, extra_options: resourceEdited })
      .then(async (ans) => {})
      .catch((err) => {
        console.warn(err);
        this.toast.error({
          detail: err,
          summary: 'Error al intentar guardar cambio de peso',
        });
      })
      .finally(() => {
        this.weight = null;
        this.forSave = null;
        this.saving = false;
        this.toast.clear();
      });
  }
}
