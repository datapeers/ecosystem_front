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
  constructor(
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

  ngOnDestroy() {}

  loadContent() {
    this.service
      .getContent(this.contentID)
      .then((content) => {
        this.content = cloneDeep(content);
      })
      .catch((err) => {
        this.toast.clear();
        // this.cancelEdit(property);
        this.toast.error({ summary: 'Error al cargar contenido', detail: err });
        console.warn(err);
        this.return();
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
        contentID: this.content._id,
        phaseID: this.content.phase,
        onlyView: false,
      },
    });

    ref.onClose.subscribe(async (item) => {
      if (item) {
        this.toast.info({
          detail: '',
          summary: 'Guardando...',
          closable: false,
        });
        // const request = await this.service.addResource(
        //   this.institute.dbName,
        //   container._id,
        //   this.space._id,
        //   item
        // );
        this.toast.clear();
        // if (request.res) {
        //   this.toast.success({
        //     detail: '',
        //     summary: 'Recurso creado',
        //     life: 700,
        //   });
        //   await this.service.refetchGetResourcesContainer();
        //   this.setDisplayList();
        // } else {
        //   this.toast.error({
        //     detail:
        //       'No se guardo correctamente el recurso, comuniquese con un administrador',
        //     summary: 'Error al guardar',
        //   });
        // }
      }
    });
  }
}
