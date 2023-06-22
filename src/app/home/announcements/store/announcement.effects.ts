import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as fromAnnouncement from './announcement.actions';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AnnouncementsService } from '../announcements.service';
import { ToastService } from '@shared/services/toast.service';

@Injectable()
export class AnnouncementEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private announcementsService: AnnouncementsService,
    private readonly toast: ToastService,
  ) {}

  updateAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAnnouncement.UPDATE_ANNOUNCEMENT),
      switchMap(async (action: fromAnnouncement.UpdateAnnouncementAction) => {
        const current = await firstValueFrom(this.store.select(state => state.announcement.announcement));
        const updates = action.updates;
        let result = await this.announcementsService.updateAnnouncement(current._id, updates)
        .then(updatedAnnouncement => {
          this.toast.success({
            detail: "Cambios realizados con éxito"
          });
          return new fromAnnouncement.SetAnnouncementAction(updatedAnnouncement);
        })
        .catch(ex => {
          console.error(ex);
          this.toast.error({
            detail: "Ocurrio un error al actualizar los datos"
          });
          return new fromAnnouncement.FailUpdateAnnouncementAction("Error al actualizar datos");
        });
        return result;
      })
    )
  );

  updateAnnouncementImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAnnouncement.UPDATE_ANNOUNCEMENT_IMAGE),
      switchMap(async (action: fromAnnouncement.UpdateAnnouncementImageAction) => {
        const current = await firstValueFrom(this.store.select(state => state.announcement.announcement));
        const imageUrl = action.imageUrl;
        let result = await this.announcementsService.updateAnnouncement(current._id, { thumbnail: imageUrl })
        .then(updatedAnnouncement => {
          this.toast.success({
            detail: "Imagen actualizada con éxito"
          });
          return new fromAnnouncement.SetAnnouncementAction(updatedAnnouncement);
        })
        .catch(ex => {
          this.toast.success({
            detail: "Ocurrio un error al actualizar la imagen"
          });
          return new fromAnnouncement.FailUpdateAnnouncementAction("Error al actualizar datos");
        });
        return result;
      })
    )
  );

  publishAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAnnouncement.PUBLISH_ANNOUNCEMENT),
      switchMap(async (action: fromAnnouncement.PublishAnnouncementAction) => {
        const current = await firstValueFrom(this.store.select(state => state.announcement.announcement));
        let result = await this.announcementsService.publishAnnouncement(current._id)
        .then(updatedAnnouncement => {
          this.toast.success({
            detail: "Cambios realizados con éxito"
          });
          return new fromAnnouncement.SetAnnouncementAction(updatedAnnouncement);
        })
        .catch(ex => {
          console.error(ex);
          this.toast.error({
            detail: "Ocurrio un error al actualizar los datos"
          });
          return new fromAnnouncement.FailUpdateAnnouncementAction("Error al actualizar datos");
        });
        return result;
      })
    )
  );

  unpublishAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAnnouncement.UNPUBLISH_ANNOUNCEMENT),
      switchMap(async (action: fromAnnouncement.UnpublishAnnouncementAction) => {
        const current = await firstValueFrom(this.store.select(state => state.announcement.announcement));
        let result = await this.announcementsService.unpublishAnnouncement(current._id)
        .then(updatedAnnouncement => {
          this.toast.success({
            detail: "Cambios realizados con éxito"
          });
          return new fromAnnouncement.SetAnnouncementAction(updatedAnnouncement);
        })
        .catch(ex => {
          console.error(ex);
          this.toast.error({
            detail: "Ocurrio un error al actualizar los datos"
          });
          return new fromAnnouncement.FailUpdateAnnouncementAction("Error al actualizar datos");
        });
        return result;
      })
    )
  );
}
