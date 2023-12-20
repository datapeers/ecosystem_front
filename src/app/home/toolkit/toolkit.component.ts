import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Phase } from '@home/phases/model/phase.model';
import { PhaseHomeworksService } from '@home/phases/phase-homeworks/phase-homeworks.service';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { ToastService } from '@shared/services/toast.service';
import {
  first,
  firstValueFrom,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { PhaseContentService } from '../phases/phase-content/phase-content.service';
import { Content } from '@home/phases/model/content.model';
import * as moment from 'moment';
import { ResourceReply } from '@home/phases/phase-homeworks/model/resource-reply.model';
import { ResourcesTypes } from '@home/phases/model/resources-types.model';
import { StorageService } from '@shared/storage/storage.service';
import { ResourceReplyState } from '@home/phases/phase-homeworks/model/resource-reply-states';
import { PhasesService } from '@home/phases/phases.service';
import { ActivatedRoute } from '@angular/router';
import { ShepherdService } from 'angular-shepherd';
import { toolkitOnboarding } from '@shared/onboarding/onboarding.config';

@Component({
  selector: 'app-toolkit',
  templateUrl: './toolkit.component.html',
  styleUrls: ['./toolkit.component.scss'],
})
export class ToolkitComponent implements OnInit, OnDestroy {
  loaded = false;
  currentBatch: Phase;
  user: User;
  profileDoc;
  startup: Startup;
  watchContent$: Subscription;
  paramSub$: Subscription;
  dialogRef;
  onCloseDialogSub$: Subscription;
  sprints: Content[];
  sprintSelected: Content;
  cards: ResourceReply[];
  onDestroy$: Subject<void> = new Subject();
  selected = 'grid';
  phasesUser: Phase[] = [];
  selectedItem: any;
  public get resourcesTypes(): typeof ResourcesTypes {
    return ResourcesTypes;
  }

  public get resourcesStates(): typeof ResourceReplyState {
    return ResourceReplyState;
  }

  launchTour() {
    this.shepherdService.addSteps(toolkitOnboarding);
    this.shepherdService.start();
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private toast: ToastService,
    private phasesService: PhasesService,
    private phaseContentService: PhaseContentService,
    private phaseHomeworksService: PhaseHomeworksService,
    private readonly shepherdService: ShepherdService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.preload();
  }

  ngOnDestroy(): void {
    this.watchContent$?.unsubscribe();
    this.onCloseDialogSub$?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.paramSub$?.unsubscribe();
  }

  async loadComponent(batch) {
    this.loaded = false;
    if (batch === 'without batch') {
      this.toast.info({
        summary: 'Aun no participas',
        detail: 'Tu startup aun no esta en ninguna etapa',
      });
      this.loaded = false;
      return;
    }
    this.currentBatch = batch;
    this.watchContent$ = (
      await this.phaseContentService.watchContents(this.currentBatch._id)
    ).subscribe(async (i) => {
      this.loaded = false;
      this.sprints = i;
      this.sprintSelected =
        this.sprints.find((i) =>
          moment(new Date()).isBetween(
            i.extra_options.start,
            i.extra_options.end
          )
        ) ?? this.sprints[this.sprints.length - 1];
      await this.setCards();
      this.loaded = true;
    });
  }

  async preload() {
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    this.startup = this.profileDoc.startups[0];
    const userPhases = await this.phasesService.getPhasesList(
      this.profileDoc['startups'][0].phases.map((i) => i._id),
      true
    );
    this.phasesUser = userPhases.filter((i) => !i.basePhase);
    this.paramSub$ = this.route.queryParamMap.subscribe(async (params) => {
      const batchId = params.get('batch');
      let batch: any = this.phasesUser.find((i) => i._id === batchId);
      if (!batch) {
        batch = await firstValueFrom(
          this.store
            .select((store) => store.home.currentBatch)
            .pipe(first((i) => i !== null))
        );
      }
      this.loadComponent(batch);
    });
  }

  async setCards() {
    this.cards = await this.phaseHomeworksService.setResourcesRepliesSprint(
      this.startup,
      this.currentBatch,
      this.sprintSelected
    );
  }

  async openForm(reply: ResourceReply) {
    const ref = await this.phaseHomeworksService.openFormResource(reply);
    if (ref)
      ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
        if (doc) {
          this.setCards();
        }
      });
  }

  downloadFile(reply: ResourceReply) {
    this.phaseHomeworksService
      .downloadFileAndCheck(reply, this.user)
      .then((updated) => {
        if (updated) {
          this.setCards();
        }
      });
  }

  async downloadFileReply(reply: ResourceReply) {
    this.phaseHomeworksService.downloadFileReply(reply);
  }

  async selectFile(element: HTMLInputElement, reply: ResourceReply) {
    const files = element.files;
    if (files && files.item(0)) {
      await this.phaseHomeworksService.uploadTaskReply(
        files.item(0),
        reply,
        this.user
      );
      this.setCards();
    }
  }

  setItem(item) {
    this.selectedItem = item;
  }
}
