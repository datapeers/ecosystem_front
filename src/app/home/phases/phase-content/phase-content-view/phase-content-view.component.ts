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

  ngOnDestroy() {}

  async loadContent() {
    firstValueFrom(
      this.store.select((i) => i.phase.phase).pipe(first((i) => i !== null))
    ).then((phase) => (this.phase = phase));
    this.watchContent$ = (
      await this.service.watchContent(this.contentID)
    ).subscribe((content) => {
      this.content = cloneDeep(content);
      console.log(this.content);
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
}
