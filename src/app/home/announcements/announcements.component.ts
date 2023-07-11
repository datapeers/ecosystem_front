import { Component } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './model/announcement';
import { Router } from '@angular/router';
import { AnnouncementTypes } from './model/announcement-types.enum';
import {
  AnnouncementTargets,
  announcementTargetNames,
} from './model/announcement-targets.enum';
import { MenuItem } from 'primeng/api';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
})
export class AnnouncementsComponent {
  onDestroy$: Subject<void> = new Subject();
  loading: boolean = true;
  announcements: Announcement[];
  user: User;
  createOpenActions: MenuItem[] = [
    {
      label: announcementTargetNames.entrepreneurs,
      command: () => {
        this.createAnnouncement(
          AnnouncementTypes.open,
          AnnouncementTargets.entrepreneurs
        );
      },
    },
    {
      label: announcementTargetNames.experts,
      command: () => {
        this.createAnnouncement(
          AnnouncementTypes.open,
          AnnouncementTargets.experts
        );
      },
    },
  ];
  createChallengeActions: MenuItem[] = [
    {
      label: announcementTargetNames.entrepreneurs,
      command: () => {
        this.createAnnouncement(
          AnnouncementTypes.challenge,
          AnnouncementTargets.entrepreneurs
        );
      },
    },
  ];
  cardActions = [
    {
      label: 'Gestionar',
      command: (event: MouseEvent, announcement: Announcement) => {
        this.navigateToEdit(announcement._id);
      },
    },
  ];

  constructor(
    private store: Store<AppState>,
    private readonly announcementsService: AnnouncementsService,
    private readonly router: Router
  ) {
    this.announcementsService
      .watchAnnouncements()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((announcements) => {
        this.announcements = announcements;
        this.loading = false;
      });
    this.store
      .select((state) => state.auth.user)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((user) => user != null)
      )
      .subscribe((user) => {
        this.user = user;
        console.log(this.user);
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async createAnnouncement(
    type: AnnouncementTypes,
    target: AnnouncementTargets
  ) {
    this.announcementsService.openCreateAnnouncement(type, target);
  }

  navigateToEdit(id: string) {
    this.router.navigate([`/home/announcements/${id}/edit`]);
  }
}
