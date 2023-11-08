import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { PhaseContentService } from './phase-content.service';
import {
  Subject,
  Subscription,
  debounceTime,
  first,
  firstValueFrom,
  takeUntil,
} from 'rxjs';
import { Phase } from '../model/phase.model';
import { DialogService } from 'primeng/dynamicdialog';
import { PhaseContentCreatorComponent } from './phase-content-creator/phase-content-creator.component';
import { cloneDeep } from 'lodash';
import { Content } from '../model/content.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';

@Component({
  selector: 'app-phase-content',
  templateUrl: './phase-content.component.html',
  styleUrls: ['./phase-content.component.scss'],
})
export class PhaseContentComponent implements OnInit, OnDestroy {
  loaded = false;
  phase: Phase;
  watchContent$: Subscription;
  dialogRef;
  onCloseDialogSub$: Subscription;
  contentList = [];
  table = [];
  displayTable = false;
  routeSubscription$: Subscription;
  selectedContent: Content;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    public dialogService: DialogService,
    private service: PhaseContentService
  ) {}

  filter(table: TreeTable, evt: Event) {
    table.filterGlobal((evt.target as any).value, 'contains');
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
      await this.service.watchContents(this.phase._id)
    ).subscribe((i) => {
      this.loaded = false;
      this.contentList = cloneDeep(i);
      this.table = [];
      this.displayTable = false;
      this.table = this.contentList
        .filter((content) => content.isDeleted == false)
        .map((content, index, arr) => {
          return this.service.convertContainerToNode(
            content,
            0,
            index == 0,
            index == arr.length
          );
        });
      this.loaded = true;
    });
  }

  openCreator(content?) {
    this.dialogRef = this.dialogService.open(PhaseContentCreatorComponent, {
      header: content ? 'Añadir contenido' : 'Añadir sprint',
      width: '75vw',
      maskStyleClass: 'dialog-app',
      data: {
        batch: this.phase,
        content,
        lastSprint: this.contentList.length
          ? this.contentList[this.contentList.length - 1]
          : undefined,
      },
    });

    this.onCloseDialogSub$ = this.dialogRef.onClose.subscribe(async (data) => {
      this.onCloseDialogSub$.unsubscribe();
      this.dialogRef = null;
    });
  }

  selectViewContent(content: Content) {
    this.router.navigate([content._id], { relativeTo: this.route });
  }

  selectContent(content: Content) {
    this.selectedContent = cloneDeep(content);
    if (!this.selectedContent.extra_options)
      this.selectedContent['extra_options'] = { points: 100 };
    if (!this.selectedContent.extra_options?.points)
      this.selectedContent.extra_options.points = 100;
  }

  invertHide(content: Content) {
    this.toast.info({ summary: 'Guardando...', detail: '' });
    this.service
      .updateContent({ _id: content._id, hide: !content.hide })
      .then(() => {
        this.toast.clear();
      })
      .catch((err) => {
        this.failChange(err);
      });
  }

  changeExtraOptions() {
    this.toast.info({ summary: 'Guardando...', detail: '' });
    this.service
      .updateContent({
        _id: this.selectedContent._id,
        extra_options: { ...this.selectedContent.extra_options },
      })
      .then(() => {
        this.toast.clear();
        this.toast.info({ summary: 'Cambio guardado', detail: '', life: 2000 });
      })
      .catch((err) => {
        this.failChange(err);
      });
  }

  deleteContent(content: Content) {
    this.toast.info({ summary: 'Borrando...', detail: '' });
    this.service
      .updateContent({ _id: content._id, isDeleted: true })
      .then(() => {
        this.toast.clear();
      })
      .catch((err) => {
        this.failChange(err);
      });
  }

  failChange(err) {
    this.toast.clear();
    // this.cancelEdit(property);
    this.toast.error({ summary: 'Error al guardar cambios', detail: err });
    console.warn(err);
  }
}
