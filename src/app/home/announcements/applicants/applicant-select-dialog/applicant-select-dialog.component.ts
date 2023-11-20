import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantsService } from '@shared/services/applicants/applicants.service';
import {
  ApplicantState,
  Attachment,
} from '@home/announcements/model/applicant-state';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Applicant } from '@shared/models/entities/applicant';
import { StorageService } from '@shared/storage/storage.service';
import { ToastService } from '@shared/services/toast.service';
import {
  ApplicationStates,
  applicationStatesUtilities,
} from '../../model/application-states.enum';
import { PhasesService } from '@home/phases/phases.service';
import { Subscription } from 'rxjs';
import { Phase } from '@home/phases/model/phase.model';
import { Announcement } from '@home/announcements/model/announcement';

@Component({
  selector: 'app-applicant-select-dialog',
  templateUrl: './applicant-select-dialog.component.html',
  styleUrls: ['./applicant-select-dialog.component.scss'],
})
export class ApplicantSelectDialogComponent implements OnInit {
  announcementId: string;
  applicantId: string;
  applicant: Applicant;
  currentState: ApplicationStates;
  announcement: Announcement;
  loaded = false;
  listBatch: Phase[] = [];
  batchSelected: Phase;
  saving = false;
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly applicantsService: ApplicantsService,
    private readonly storageService: StorageService,
    private readonly toastService: ToastService,
    private readonly phaseService: PhasesService
  ) {
    const { announcement, currentState, id, announcementId } = this.config.data;
    this.applicantId = id;
    this.announcementId = announcementId;
    this.currentState = currentState;
    this.announcement = announcement;
  }

  ngOnInit() {
    this.loadComponent();
  }

  async loadComponent() {
    this.loaded = false;
    const applicant = await this.applicantsService.getApplicant(
      this.applicantId,
      this.currentState
    );
    if (!applicant) return;
    this.applicant = applicant;
    if (
      this.applicant.states.find((i) => i.type === ApplicationStates.selected)
    ) {
      this.toastService.info({
        summary: 'El participante ya ha sido seleccionado',
        detail: `Este participante ya figura como que ha sido seleccionado previamente`,
        life: 3000,
      });
      this.close();
      return;
    }
    // ------------Load phase -----------------------------------
    // --- LOAD PHASES -------------------
    this.listBatch = (await this.phaseService.getPhases()).filter(
      (i) => !(i.basePhase || !i.isActive)
    );
    this.loaded = true;
  }

  close() {
    this.ref.close();
  }

  saveSelected() {
    this.saving = true;
    this.toastService.info({
      summary: 'Guardando...',
      detail: 'Por favor espere',
      life: 30000,
    });
    this.applicantsService
      .selectApplicant(
        this.applicant._id,
        this.batchSelected._id,
        this.batchSelected.name,
        this.announcement.target
      )
      .then((ans) => {
        this.toastService.clear();
        this.close();
      })
      .catch((err) => {
        this.toastService.clear();
        console.warn(err);
      });
  }
}
