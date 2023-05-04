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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

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
}
