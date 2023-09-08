import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Content } from '@home/phases/model/content.model';
import { Phase } from '@home/phases/model/phase.model';
import { PhaseContentService } from '@home/phases/phase-content/phase-content.service';
import { PhaseHomeworksService } from '@home/phases/phase-homeworks/phase-homeworks.service';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { ToastService } from '@shared/services/toast.service';
import {
  firstValueFrom,
  first,
  Subscription,
  take,
  takeUntil,
  Subject,
} from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RestoreMenuAction,
  SetOtherMenuAction,
} from '@home/store/home.actions';
import { ContentsService } from './contents.service';
import { ResourceReply } from '@home/phases/phase-homeworks/model/resource-reply.model';
import { ResourceReplyState } from '@home/phases/phase-homeworks/model/resource-reply-states';
import {
  ResourcesTypes,
  resourcesTypesNames,
} from '@home/phases/model/resources-types.model';
import { IUserLog } from './models/user-logs';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
})
export class ContentsComponent implements OnInit, OnDestroy {
  user: User;
  loaded = false;
  profileDoc;
  startup: Startup;
  currentBatch: Phase;
  dialogRef;
  onCloseDialogSub$: Subscription;
  onDestroy$: Subject<void> = new Subject();
  logs: IUserLog[] = [];
  sprints: Content[];
  sprintSelected: Content;
  paramSub$: Subscription;
  contentSelected: Content;
  indexContent = 0;
  nextContent: boolean = false;
  previousContent: boolean = false;

  marked = true;
  // Homeworks --------------------------------------------------
  homeworks: ResourceReply[] = [];
  viewHomeworks = false;
  resourcesTypesNames = resourcesTypesNames;
  public get resourcesStates(): typeof ResourceReplyState {
    return ResourceReplyState;
  }

  public get resourcesTypes(): typeof ResourcesTypes {
    return ResourcesTypes;
  }

  // logs -------------------------------------------------------
  userLogs$: Subscription;
  contentCompleted = {};
  savingCompleted = false;

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private service: ContentsService,
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
    this.onCloseDialogSub$?.unsubscribe();
    this.userLogs$?.unsubscribe();
    // this.store.dispatch(new RestoreMenuAction());
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
    this.phaseContentService
      .getContents(this.currentBatch._id)
      .then(async (i) => {
        this.loaded = false;
        this.sprints = i;
        const previousSprint = (
          await firstValueFrom(this.route.queryParamMap)
        ).get('sprint');
        if (!previousSprint) {
          this.sprintSelected =
            this.sprints.find((i) =>
              moment(new Date()).isBetween(
                i.extra_options.start,
                i.extra_options.end
              )
            ) ?? this.sprints[this.sprints.length - 1];
        }
        this.watchLogPhase(this.currentBatch, this.startup);
        this.watchContentSelector();
        this.changesSprint();
        this.loaded = true;
      });
  }

  watchLogPhase(currentBatch: Phase, startup: Startup) {
    this.service
      .watchLogsWithFilter({
        'metadata.batch': currentBatch._id,
        'metadata.startup': this.startup._id,
      })
      .then((logs$) => {
        this.userLogs$ = logs$.subscribe((logsList) => {
          this.logs = logsList;
          // console.log(this.logs);
          this.setContentCompleted(this.logs);
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar logs de usuario',
          detail: err,
          life: 12000,
        });
      });
  }

  changesSprint(content?: string) {
    this.router.navigate(['/home/contents'], {
      queryParams: { sprint: this.sprintSelected?._id, content },
    });
  }

  watchContentSelector() {
    this.paramSub$ = this.route.queryParamMap.subscribe((params) => {
      const sprintId = params.get('sprint');
      const contentId = params.get('content');
      this.setContentDisplay(sprintId, contentId);
    });
  }

  async setContentDisplay(sprintId: string, contentId: string) {
    this.homeworks = [];
    if (!sprintId) {
      return;
    }
    this.sprintSelected = this.sprints.find((i) => i._id === sprintId);
    if (!this.sprintSelected) {
      this.toast.alert({
        summary: 'Sprint invalido',
        detail: 'Sprint no encontrado',
      });
      return;
    }
    const menu = await this.service.optionsMenu(this.sprintSelected, this.user);
    // this.store.dispatch(new SetOtherMenuAction(menu));
    this.indexContent = 0;
    this.contentSelected = this.sprintSelected.childs[0];
    if (contentId) {
      const indexContent = this.sprintSelected.childs.findIndex(
        (i) => i._id === contentId
      );
      if (indexContent !== -1) {
        this.contentSelected = this.sprintSelected.childs[indexContent];
        this.indexContent = indexContent;
      }
    }
    this.previousContent = this.indexContent > 0 ? true : false;
    this.nextContent =
      this.indexContent !== this.sprintSelected.childs.length - 1;
    this.loadHomeworks();
  }

  async loadHomeworks() {
    this.homeworks = await this.phaseHomeworksService.setResourcesReplies(
      this.startup,
      this.currentBatch,
      this.sprintSelected,
      this.contentSelected
    );
    this.homeworks = [...this.homeworks];
  }

  changeContent(index: number) {
    const nextContent = this.sprintSelected.childs[index];
    if (nextContent) {
      this.setContentDisplay(this.sprintSelected._id, nextContent._id);
    }
  }

  async openForm(reply: ResourceReply) {
    const ref = await this.phaseHomeworksService.openFormResource(reply);
    if (ref)
      ref.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((doc) => {
        if (doc) {
          this.loadHomeworks();
        }
      });
  }

  downloadFile(reply: ResourceReply) {
    this.phaseHomeworksService
      .downloadFileAndCheck(reply, this.user)
      .then((updated) => {
        if (updated) {
          this.loadHomeworks();
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
      this.loadHomeworks();
    }
  }

  alertState(reply: ResourceReply) {
    return [
      ResourceReplyState.Pendiente,
      ResourceReplyState['Sin descargar'],
      ResourceReplyState['No aprobado'],
    ].includes(reply.state as ResourceReplyState);
  }

  setContentCompleted(logs: IUserLog[]) {
    this.contentCompleted = {};
    const logsOfContent = logs.filter((i) => i.metadata?.content);
    for (const log of logsOfContent)
      this.contentCompleted[log.metadata.content] = log;
  }

  markAsCompleted() {
    this.savingCompleted = true;
    this.service
      .createLog({
        batch: this.currentBatch._id,
        startup: this.startup._id,
        sprint: this.sprintSelected._id,
        content: this.contentSelected._id,
      })
      .catch((err) =>
        this.toast.error({ summary: 'Error!', detail: err, life: 12000 })
      )
      .finally(() => (this.savingCompleted = false));
  }
}
