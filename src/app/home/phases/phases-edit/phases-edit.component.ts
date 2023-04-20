import { Component } from '@angular/core';
import { Phase } from '../model/phase.model';
import { PhasesService } from '../phases.service';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { UpdatePhaseImageAction } from '../store/phase.actions';

@Component({
  selector: 'app-phases-edit',
  templateUrl: './phases-edit.component.html',
  styleUrls: ['./phases-edit.component.scss'],
})
export class PhasesEditComponent {
  phase: Phase;

  constructor(
    private readonly service: PhasesService,
    private readonly store: Store<AppState>
  ) {
    this.store
      .select((state) => state.phase.phase)
      .subscribe((phase) => {
        this.phase = phase;
      });
  }

  ngOnInit() {}

  imageSelected: any;
  selectFile(element: HTMLInputElement, phase: Phase) {
    const files = element.files;
    if (files && files.item(0)) {
      this.upload(files.item(0), phase);
    }
  }

  async upload(fileToUpload: File, phase: Phase) {
    this.service
      .updatePhaseThumbnail(phase, fileToUpload)
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Display upload progress if required
          }
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          this.service.updatePhase(phase._id, { thumbnail: event.url });
          this.store.dispatch(new UpdatePhaseImageAction(event.url));
        }
      });
  }

  removeImage(phase: Phase) {
    this.service.removePhaseThumbnail(phase).subscribe((event) => {
      if (event.type === HttpEventType.Response) {
        this.store.dispatch(new UpdatePhaseImageAction(''));
      }
    });
  }
}
