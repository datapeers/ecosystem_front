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
  tap,
} from 'rxjs';
import { PhaseContentService } from '../phases/phase-content/phase-content.service';
import { Content } from '@home/phases/model/content.model';
import * as moment from 'moment';
import {
  ResourceReply,
  createSimpleResourceReply,
} from '@home/phases/phase-homeworks/model/resource-reply.model';
import { ResourcesTypes } from '@home/phases/model/resources-types.model';
import { FormService } from '@shared/form/form.service';
import { StorageService } from '@shared/storage/storage.service';
import { ResourceReplyState } from '@home/phases/phase-homeworks/model/resource-reply-states';

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
  dialogRef;
  onCloseDialogSub$: Subscription;
  sprints: Content[];
  sprintSelected: Content;
  cards: ResourceReply[];
  onDestroy$: Subject<void> = new Subject();
  public get resourcesTypes(): typeof ResourcesTypes {
    return ResourcesTypes;
  }

  public get resourcesStates(): typeof ResourceReplyState {
    return ResourceReplyState;
  }

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private readonly formService: FormService,
    private storageService: StorageService,
    private phaseContentService: PhaseContentService,
    private phaseHomeworksService: PhaseHomeworksService
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
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.loaded = false;
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    this.startup = this.profileDoc.startups[0];
    const currentBatch = await firstValueFrom(
      this.store
        .select((store) => store.home.currentBatch)
        .pipe(first((i) => i !== null))
    );
    if (currentBatch === 'without batch') {
      this.toast.info({
        summary: 'Aun no participas',
        detail: 'Tu startup aun no esta en ninguna etapa',
      });
      this.loaded = false;
      return;
    }
    this.currentBatch = currentBatch;
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

  async setCards() {
    this.cards = [];
    const repliesSaved = await this.phaseHomeworksService.getDocumentsStartup(
      this.startup._id,
      this.currentBatch._id
    );
    for (const resourceSprint of this.sprintSelected.resources) {
      let reply = repliesSaved.find(
        (i) => i.resource._id === resourceSprint._id
      );
      if (!reply) {
        reply = createSimpleResourceReply(
          this.startup,
          resourceSprint,
          this.sprintSelected,
          this.currentBatch
        );
      }
      this.cards.push({
        ...reply,
        startup: this.startup,
        sprint: this.sprintSelected,
        phase: this.currentBatch,
      });
    }
    for (const content of this.sprintSelected.childs) {
      for (const resourceContent of content.resources) {
        let reply = repliesSaved.find(
          (i) => i.resource._id === resourceContent._id
        );
        if (!reply)
          reply = createSimpleResourceReply(
            this.startup,
            resourceContent,
            this.sprintSelected,
            this.currentBatch
          );
        this.cards.push({
          ...reply,
          startup: this.startup,
          sprint: this.sprintSelected,
          phase: this.currentBatch,
        });
      }
    }
  }

  async openForm(reply: ResourceReply) {
    if (moment(new Date()).isAfter(reply.resource.extra_options.end)) {
      this.toast.info({
        summary: 'Fecha limite',
        detail: 'Esta tarea ya supero el tiempo limite para su realización',
      });
      return;
    }
    this.toast.loading();
    const subscription = await this.formService.createFormSubscription({
      form: reply.resource.extra_options.form,
      reason: 'Abrir formulario recurso desde toolkit',
      data: {
        startup: reply.startup._id,
        sprint: reply.sprint._id,
        resource: reply.resource._id,
        phase: this.currentBatch._id,
        type: reply.resource.type,
        state: 'Sin evaluar',
      },
      doc: reply._id,
    });
    this.toast.clear();
    const ref = this.formService.openFormFromSubscription(
      subscription,
      `Diligenciar ${reply.resource.name}`
    );
    ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
      if (doc) {
        this.setCards();
      }
    });
  }

  async downloadFile(reply: ResourceReply) {
    const resource = reply.resource;
    const file = resource?.extra_options?.file;
    this.toast.info({ summary: 'Descargando', detail: '' });
    const key = this.storageService.getKey(file);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      this.toast.clear();
      if (reply.state === ResourceReplyState['Sin descargar']) {
        this.phaseHomeworksService
          .createResourceReply({
            item: { user: this.user._id },
            phase: reply.phase._id,
            startup: reply.startup._id,
            sprint: reply.sprint._id,
            resource: reply.resource._id,
            type: reply.resource.type,
            state: ResourceReplyState.Descargado,
          })
          .then((i) => this.setCards());
      }
      window.open(url, '_blank');
    }
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
}
