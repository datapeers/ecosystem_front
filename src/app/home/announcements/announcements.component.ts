import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './model/announcement';
import { Router } from '@angular/router';
import { AnnouncementTypes } from './model/announcement-types.enum';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent {
  onDestroy$: Subject<void> = new Subject();
  loading: boolean = true;
  announcements: Announcement[];

  cardActions = [
    {
      label: "Gestionar",
      command: (event: MouseEvent, announcement: Announcement) => {
        this.navigateToEdit(announcement._id);
      }
    }
  ]

  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly router: Router,
  ) {
    this.announcementsService.watchAnnouncements()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((announcements) => {
      this.announcements = announcements;
      this.loading = false;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async createOpenAnnouncement() {
    this.announcementsService.openCreateAnnouncement(AnnouncementTypes.open);
  }

  async createChallenge() {
    this.announcementsService.openCreateAnnouncement(AnnouncementTypes.challenge);
  }

  navigateToEdit(id: string) {
    this.router.navigate([`/home/announcements/${id}/edit`]);
  }
}
