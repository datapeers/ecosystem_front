import { Component, OnDestroy, OnInit } from '@angular/core';
import { Phase } from '../model/phase.model';
import { PhasesService } from '../phases.service';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { SetPhaseAction, UpdatePhaseImageAction } from '../store/phase.actions';
import { ToastService } from '@shared/services/toast.service';
import { cloneDeep } from 'lodash';
import { configTinyMce } from '@shared/models/configTinyMce';

@Component({
  selector: 'app-phases-edit',
  templateUrl: './phases-edit.component.html',
  styleUrls: ['./phases-edit.component.scss'],
})
export class PhasesEditComponent implements OnInit, OnDestroy {
  phase: Phase;
  phase$: Subscription;
  clonedEdit: { [s: string]: Phase } = {};
  configTiny = configTinyMce;
  constructor(
    private readonly service: PhasesService,
    private readonly store: Store<AppState>,
    private toast: ToastService
  ) {
    this.phase$ = this.store
      .select((state) => state.phase.phase)
      .subscribe((phase) => {
        this.phase = cloneDeep(phase);
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.phase$?.unsubscribe();
  }

  openEdit(property: string) {
    this.clonedEdit[property] = this.phase[property];
  }

  async saveEdit(property: string) {
    this.toast.info({ summary: 'Guardando...', detail: '' });
    const updateItem = {};
    updateItem[property] = this.clonedEdit[property];
    this.service
      .updatePhase(this.phase._id, updateItem)
      .then((phase) => {
        this.toast.clear();
        this.cancelEdit(property);
        this.store.dispatch(new SetPhaseAction(phase));
      })
      .catch((err) => {
        this.toast.clear();
        // this.cancelEdit(property);
        this.toast.error({ summary: 'Error al guardar cambios', detail: err });
        console.warn(err);
      });
  }

  cancelEdit(property: string) {
    this.phase[property] = this.clonedEdit[property];
    delete this.clonedEdit[property];
  }

  imageSelected: any;
  selectFile(element: HTMLInputElement, phase: Phase) {
    const files = element.files;
    if (files && files.item(0)) {
      this.upload(files.item(0), phase);
    }
  }

  async upload(fileToUpload: File, phase: Phase) {
    this.service
      .updatePhaseThumbnail(phase, fileToUpload)
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Display upload progress if required
          }
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          this.service.updatePhase(phase._id, { thumbnail: event.url });
          this.store.dispatch(new UpdatePhaseImageAction(event.url));
        }
      });
  }

  removeImage(phase: Phase) {
    this.service.removePhaseThumbnail(phase).subscribe((event) => {
      if (event.type === HttpEventType.Response) {
        this.store.dispatch(new UpdatePhaseImageAction(''));
      }
    });
  }
}
