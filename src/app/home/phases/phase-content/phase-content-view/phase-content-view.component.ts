import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Location } from '@angular/common';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { PhaseContentService } from '../phase-content.service';

@Component({
  selector: 'app-phase-content-view',
  templateUrl: './phase-content-view.component.html',
  styleUrls: ['./phase-content-view.component.scss'],
})
export class PhaseContentViewComponent implements OnInit, OnDestroy {
  faReply = faReply;
  contentID;
  constructor(
    private routeOpt: ActivatedRoute,
    private _location: Location,
    public dialogService: DialogService,
    private toast: ToastService,
    private confirmationService: ConfirmationService,
    private service: PhaseContentService
  ) {
    this.contentID = this.routeOpt.snapshot.params['idContent'];
  }

  ngOnInit() {
    this.loadContent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  loadContent() {
    this.service
      .getContent(this.contentID)
      .then(console.log)
      .catch(console.warn);
  }

  return() {
    this._location.back();
  }
}
