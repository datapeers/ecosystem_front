import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { RestoreMenuAction, SetOtherMenuAction } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { AnnouncementsService } from '../announcements.service';
import { ClearAnnouncementStoreAction, SetAnnouncementAction } from '../store/announcement.actions';

@Component({
  selector: 'app-announcement-load',
  templateUrl: './announcement-load.component.html',
  styleUrls: ['./announcement-load.component.scss']
})
export class AnnouncementLoadComponent {
  announcementId: string;
  announcement$ = this.store.select(state => state.announcement.announcement);
  constructor(
    private readonly store: Store<AppState>,
    private readonly announcementsService: AnnouncementsService,
    private readonly route: ActivatedRoute,
  ) {
    this.announcementId = route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearAnnouncementStoreAction());
    this.store.dispatch(new RestoreMenuAction());
  }

  async loadComponent() {
    const announcement = await this.announcementsService.getAnnouncement(this.announcementId);
    const menu = await this.announcementsService.optionsMenu(announcement);
    this.store.dispatch(new SetAnnouncementAction(announcement));
    this.store.dispatch(new SetOtherMenuAction(menu));
  }
}
