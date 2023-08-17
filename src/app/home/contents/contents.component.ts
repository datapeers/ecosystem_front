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
import { firstValueFrom, first, Subscription } from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RestoreMenuAction,
  SetOtherMenuAction,
} from '@home/store/home.actions';
import { ContentsService } from './contents.service';
import { Resource } from '@home/phases/model/resource.model';
import { cloneDeep } from 'lodash';

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
  sprints: Content[];
  sprintSelected: Content;

  paramSub$: Subscription;
  contentSelected: Content;
  indexContent = 0;
  nextContent: boolean = false;
  previousContent: boolean = false;
  homeworks: Resource[] = [];
  viewHomeworks = false;
  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private service: ContentsService,
    // private readonly formService: FormService,
    // private storageService: StorageService,
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
    this.store.dispatch(new RestoreMenuAction());
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
        this.watchContent();
        this.changesSprint();
        this.loaded = true;
      });
  }

  changesSprint(content?: string) {
    this.router.navigate(['/home/contents'], {
      queryParams: { sprint: this.sprintSelected?._id, content },
    });
  }

  watchContent() {
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
    this.store.dispatch(new SetOtherMenuAction(menu));
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
    if (this.sprintSelected?.resources.length)
      this.homeworks = this.homeworks.concat(this.sprintSelected.resources);
    if (this.contentSelected?.resources.length)
      this.homeworks = this.homeworks.concat(this.contentSelected.resources);
  }

  changeContent(index: number) {
    const nextContent = this.sprintSelected.childs[index];
    if (nextContent) {
      this.setContentDisplay(this.sprintSelected._id, nextContent._id);
    }
  }
}
