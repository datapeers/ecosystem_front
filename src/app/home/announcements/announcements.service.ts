import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { StoragePaths } from '@shared/storage/storage.constants';
import { StorageService } from '@shared/storage/storage.service';
import { Observable, firstValueFrom, map, take } from 'rxjs';
import { Announcement } from './model/announcement';
import announcementQueries from './announcements.gql';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AnnouncementsCreatorComponent } from './announcements-creator/announcements-creator.component';
import { faClipboard, faUserCheck, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons';
import { CreateAnnouncementInput } from './model/create-announcement.input';
import { AnnouncementTypes } from './model/announcement-types.enum';
import { UpdateAnnouncementInput } from './model/update-announcement.input';
import { ApplicationStates } from './model/application-states.enum';
import { AnnouncementTargets } from './model/announcement-targets.enum';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService,
    private readonly toast: ToastService,
    private readonly dialogService: DialogService,
  ) {
    
  }

  cachedQueries = {
    announcements: null,
  };

  async getAnnouncement(id: string): Promise<Announcement> {
    const queryRef = this.graphql.refQuery(
      announcementQueries.query.getAnnouncement,
      { id },
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(queryRef).pipe(
        map((request) => request.data.announcement),
        map((announcement) => Announcement.fromJson(announcement))
      )
    );
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const refQuery = this.graphql.refQuery(
      announcementQueries.query.getAnnouncements,
      {},
      'cache-first',
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.query(refQuery).pipe(
        map((request) => request.data.announcements),
        map((announcements) => announcements.map((announcement) => Announcement.fromJson(announcement)))
      )
    );
  }

  watchAnnouncements() {
    const refQuery = this.graphql.refQuery(
      announcementQueries.query.getAnnouncements,
      {},
      'cache-first',
      { auth: true }
    );
    this.cachedQueries.announcements = refQuery;
    return this.graphql.watch_query(refQuery).valueChanges.pipe(
      map((request) => request.data.announcements),
      map((announcements) => announcements.map((announcement) => Announcement.fromJson(announcement)))
    );
  }

  async createAnnouncement(data: CreateAnnouncementInput): Promise<Announcement> {
    const refMutation = this.graphql.refMutation(
      announcementQueries.mutation.createAnnouncement,
      { createAnnouncementInput: data },
      [this.cachedQueries.announcements],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation).pipe(
        map((request) => request.data.createAnnouncement),
        map((announcement) => Announcement.fromJson(announcement))
      )
    );
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementInput): Promise<Announcement> {
    const mutRef = this.graphql.refMutation(
      announcementQueries.mutation.updateAnnouncement,
      {
        updateAnnouncementInput: {
          ...data,
          _id: id,
        }
      },
      [this.cachedQueries.announcements],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(
          map((request) => request.data.updateAnnouncement),
          map((announcement) => Announcement.fromJson(announcement))
        )
    );
  }

  async publishAnnouncement(id: string): Promise<Announcement> {
    const mutRef = this.graphql.refMutation(
      announcementQueries.mutation.publishAnnouncement,
      { id },
      [this.cachedQueries.announcements],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(
          map((request) => request.data.publishAnnouncement),
          map((announcement) => Announcement.fromJson(announcement))
        )
    );
  }
  
  async unpublishAnnouncement(id: string) {
    const mutRef = this.graphql.refMutation(
      announcementQueries.mutation.unpublishAnnouncement,
      { id },
      [this.cachedQueries.announcements],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(mutRef)
        .pipe(
          map((request) => request.data.unpublishAnnouncement),
          map((announcement) => Announcement.fromJson(announcement))
        )
    );
  }

  openCreateAnnouncement(type: AnnouncementTypes, target: AnnouncementTargets = AnnouncementTargets.entrepreneurs): Observable<any> {
    const ref = this.dialogService.open(AnnouncementsCreatorComponent, {
      modal: true,
      width: '95%',
      height: '100vh',
      data: {
        type,
        target,
      },
      header: "Creación de convocatoria",
      showHeader: true,
    });
    ref.onClose
    .pipe(take(1))
    .subscribe((doc?: string) => {
      if(doc) {
        const message = 'Documento creado con éxito';
        this.toast.success({
          detail: message
        });
      }
    });
    return ref.onClose;
  }

  updateAnnouncementThumbnail(announcement: Announcement, file: File) {
    const renamedFile = new File([file], announcement._id, {
      type: file.type,
      lastModified: file.lastModified,
    });
    return this.storageService.uploadFile(
      StoragePaths.announcementThumbnails,
      renamedFile
    );
  }

  removeAnnouncementThumbnail(announcement: Announcement) {
    return this.storageService.deleteFile(
      StoragePaths.announcementThumbnails,
      announcement._id
    );
  }

  optionsMenu(announcement: Announcement) {
    return {
      returnPath: ['home', 'announcements'],
      options: [
        {
          label: 'Información',
          rute: ['announcements', announcement._id, 'edit'],
          type: 'single',
          icon: 'file-description',
        },
        {
          label: 'Preinscritos',
          rute: ['announcements', announcement._id, 'applicants', ApplicationStates.enrolled],
          type: 'single',
          icon: faUsers,
        },
        {
          label: 'Inscritos',
          rute: ['announcements', announcement._id, 'applicants', ApplicationStates.preregistered],
          type: 'single',
          icon: faUserTie,
        },
        {
          label: 'Seleccionados',
          rute: ['announcements', announcement._id, 'applicants', ApplicationStates.selected],
          type: 'single',
          icon: faUserCheck,
        },
      ],
    };
  }
}
