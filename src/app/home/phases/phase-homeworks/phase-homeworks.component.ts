import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhaseHomeworksService } from './phase-homeworks.service';
import { PhaseContentService } from '../phase-content/phase-content.service';
import { Phase } from '../model/phase.model';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Content } from '../model/content.model';
import * as moment from 'moment';

@Component({
  selector: 'app-phase-homeworks',
  templateUrl: './phase-homeworks.component.html',
  styleUrls: ['./phase-homeworks.component.scss'],
})
export class PhaseHomeworksComponent implements OnInit, OnDestroy {
  loaded = false;
  user: User;
  phase: Phase;
  watchContent$: Subscription;
  dialogRef;
  onCloseDialogSub$: Subscription;

  sprints: Content[] = [];
  sprintSelected: Content;
  constructor(
    private store: Store<AppState>,
    private service: PhaseHomeworksService,
    private phaseContentService: PhaseContentService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.watchContent$?.unsubscribe();
    this.onCloseDialogSub$?.unsubscribe();
  }

  async loadComponent() {
    this.phase = await firstValueFrom(
      this.store
        .select((store) => store.phase.phase)
        .pipe(first((i) => i !== null))
    );

    this.watchContent$ = (
      await this.phaseContentService.watchContents(this.phase._id)
    ).subscribe((i) => {
      this.loaded = false;
      this.sprints = i;
      // ? the default sprint will be the one that is on the appropriate (current) date, otherwise the last sprint will be taken.
      this.sprintSelected =
        this.sprints.find((i) =>
          moment(new Date()).isBetween(
            i.extra_options.start,
            i.extra_options.end
          )
        ) ?? this.sprints[this.sprints.length - 1];
      this.loaded = true;
    });
  }
}
