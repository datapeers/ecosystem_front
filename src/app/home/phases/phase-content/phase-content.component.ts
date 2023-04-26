import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { PhaseContentService } from './phase-content.service';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { Phase } from '../model/phase.model';
import { DialogService } from 'primeng/dynamicdialog';
import { PhaseContentCreatorComponent } from './phase-content-creator/phase-content-creator.component';
import { cloneDeep } from 'lodash';
import { Content } from '../model/content.model';

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
  constructor(
    private store: Store<AppState>,
    public dialogService: DialogService,
    private service: PhaseContentService
  ) {}

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
      await this.service.watchContent(this.phase._id)
    ).subscribe((i) => {
      this.loaded = false;
      this.contentList = cloneDeep(i);
      this.table = [];
      this.displayTable = false;
      for (const iterator of this.contentList) {
        if (iterator.isDeleted == false)
          this.table.push(this.service.convertContainerToNode(iterator));
      }
      this.loaded = true;
    });
  }

  openCreatorSprint() {
    this.dialogRef = this.dialogService.open(PhaseContentCreatorComponent, {
      header: 'Añadir sprint',
      width: '75vw',
      height: '70vh',
      data: {
        phase: this.phase._id,
        sprint: true,
      },
    });

    this.onCloseDialogSub$ = this.dialogRef.onClose.subscribe(async (data) => {
      this.onCloseDialogSub$.unsubscribe();
      this.dialogRef = null;
    });
  }

  selectViewContent(content: Content) {
    console.log(content);
  }

  showInitDateDialog(content: Content, parent: Content) {
    console.log('a');
  }

  dialogWeight(content) {
    // this.weight = content.item?.puntos ?? 100;
    // this.selectedElement = content;
    console.log('b');
  }
}
