import { Component, OnDestroy, OnInit } from '@angular/core';
import { Phase } from '../model/phase.model';
import { PhasesService } from '../phases.service';
import { HttpEventType } from '@angular/common/http';
import { Subscription, first, firstValueFrom, tap } from 'rxjs';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { SetPhaseAction, UpdatePhaseImageAction } from '../store/phase.actions';
import { ToastService } from '@shared/services/toast.service';
import { cloneDeep } from 'lodash';
import { configTinyMce } from '@shared/models/configTinyMce';
import { StorageService } from '@shared/storage/storage.service';
import { Permission } from '@auth/models/permissions.enum';
import { User } from '@auth/models/user';

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
  user: User;
  public get userPermission(): typeof Permission {
    return Permission;
  }
  constructor(
    private readonly service: PhasesService,
    private readonly store: Store<AppState>,
    private storageService: StorageService,
    private toast: ToastService
  ) {
    this.phase$ = this.store
      .select((state) => state.phase.phase)
      .subscribe((phase) => {
        this.phase = cloneDeep(phase);
      });
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
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
        this.successChange(property, phase);
      })
      .catch((err) => {
        this.failChange(err);
      });
  }

  cancelEdit(property: string) {
    this.phase[property] = this.clonedEdit[property];
    delete this.clonedEdit[property];
  }

  async uploadImage(fileToUpload: File, phase: Phase) {
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
          const realUrl = this.storageService.getPureUrl(event.url);
          this.store.dispatch(new UpdatePhaseImageAction(realUrl));
          this.service
            .updatePhase(this.phase._id, { thumbnail: realUrl })
            .then((phase) => {
              this.successChange('thumbnail', phase);
            })
            .catch((err) => {
              this.failChange(err);
            });
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
  successChange(property, phase) {
    this.toast.clear();
    this.cancelEdit(property);
    this.store.dispatch(new SetPhaseAction(phase));
  }

  failChange(err) {
    this.toast.clear();
    // this.cancelEdit(property);
    this.toast.error({ summary: 'Error al guardar cambios', detail: err });
    console.warn(err);
  }
}
