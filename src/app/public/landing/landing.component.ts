import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementsService } from '../../home/announcements/announcements.service';
import { Announcement } from '@home/announcements/model/announcement';
import { FormService } from '../../shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';
import { Subject, take, takeUntil } from 'rxjs';
import { IFormSubscription } from '@shared/form/models/form-subscription';
import { AnnouncementTargets, announcementTargets } from '@home/announcements/model/announcement-targets.enum';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  id: string;
  announcement: Announcement;
  onDestroy$: Subject<void> = new Subject();
  applicantContext: {
    id?: string;
    expert?: string;
    entrepreneur?: string;
    businesses?: string[];
    startup?: string;
  } = {
    businesses: []
  };

  applicantStates = applicantStates;
  currentState: ApplicantState;

  currentSubscription$: IFormSubscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private announcementsService: AnnouncementsService,
    private readonly formService: FormService,
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loadComponent();
  }

  async loadComponent() {
    const announcement = await this.announcementsService.getAnnouncement(this.id);
    if(!announcement) { this.router.navigate([""]); }
    this.announcement = announcement;
    this.currentState = applicantStates.initial;
  }

  async registerAt() {
    switch(this.announcement.target) {
      case AnnouncementTargets.experts: await this.requestFormExpert(); break;
      case AnnouncementTargets.entrepreneurs:  await this.requestFormEntrepreneur(); break;
    }
  }

  async addBusiness() {
    await this.requestFormBusiness({
      entrepreneur: this.applicantContext.entrepreneur,
    });
  }

  async addStartup() {
    await this.requestFormStartup({
      entrepreneur: this.applicantContext.entrepreneur,
    });
  }

  async openAnnouncementForm() {
    const subscription = await this.formService.createFormSubscription({ form: this.announcement.form._id, });
    const subscriptionChanges = this.formService.listenFormSubscription(subscription._id);
    subscriptionChanges.pipe(
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe((formSubscription) => {
      if(!formSubscription.opened) {
        if(formSubscription.doc) {
          this.currentState = ApplicantState.submitted;
        }
      }
    });
    this.formService.openAnnouncementFromSubscription(this.announcement, this.applicantContext.id, subscription);
  }

  async requestFormEntrepreneur(data?: any) {
    if(this.currentSubscription$) return;
    const forms = await this.formService.getFormByCollection(FormCollections.entrepreneurs);
    const entityForm = forms.find(() => true);
    const subscription = await this.formService.createFormSubscription({
      form: entityForm._id,
      data,
    });
    this.currentSubscription$ = subscription;
    const subRef = this.formService.openFormFromSubscription(subscription, "Emprendedor");
    subRef.pipe(
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe(async (submittedDocId) => {
      if(!submittedDocId) return;
      this.currentSubscription$ = null;
      this.applicantContext.entrepreneur = submittedDocId;
      this.applicantContext.id = submittedDocId;
      this.currentState = ApplicantState.withEntrepreneur;
    });
  }

  async requestFormBusiness(data?: any) {
    if(this.currentSubscription$) return;
    const forms = await this.formService.getFormByCollection(FormCollections.businesses);
    const entityForm = forms.find(() => true);
    const subscription = await this.formService.createFormSubscription({
      form: entityForm._id,
      data,
    });
    this.currentSubscription$ = subscription;
    const subRef = this.formService.openFormFromSubscription(subscription, "Empresa");
    subRef.pipe(
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe(async (submittedDocId) => {
      if(!submittedDocId) return;
      this.currentSubscription$ = null;
      this.applicantContext.businesses.push(submittedDocId);
    });
  }

  async requestFormStartup(data?: any) {
    if(this.currentSubscription$) return;
    const forms = await this.formService.getFormByCollection(FormCollections.startups);
    const entityForm = forms.find(() => true);
    const subscription = await this.formService.createFormSubscription({
      form: entityForm._id,
      data,
    });
    this.currentSubscription$ = subscription;
    const subRef = this.formService.openFormFromSubscription(subscription, "Startup");
    subRef.pipe(
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe(async (submittedDocId) => {
      if(!submittedDocId) return;
      this.currentSubscription$ = null;
      this.applicantContext.startup = submittedDocId;
      this.currentState = ApplicantState.withStartup;
    });
  }
  
  async requestFormExpert(data?: any) {
    if(this.currentSubscription$) return;
    const forms = await this.formService.getFormByCollection(FormCollections.experts);
    const entityForm = forms.find(() => true);
    const subscription = await this.formService.createFormSubscription({
      form: entityForm._id,
      data,
    });
    this.currentSubscription$ = subscription;
    const subRef = this.formService.openFormFromSubscription(subscription, "Expert");
    subRef.pipe(
      take(1),
      takeUntil(this.onDestroy$)
    ).subscribe(async (submittedDocId) => {
      if(!submittedDocId) return;
      this.currentSubscription$ = null;
      this.applicantContext.expert = submittedDocId;
      this.applicantContext.id = submittedDocId;
      this.currentState = ApplicantState.withExpert;
    });
  }
}

export enum ApplicantState {
  initial = "initial",
  withEntrepreneur = "withEntrepreneur",
  withStartup = "withStartup",
  withExpert = "withExpert",
  submitted = "submitted",
}

export const applicantStates: Record<ApplicantState, ApplicantState> = {
  [ApplicantState.initial]: ApplicantState.initial,
  [ApplicantState.withEntrepreneur]: ApplicantState.withEntrepreneur,
  [ApplicantState.withStartup]: ApplicantState.withStartup,
  [ApplicantState.submitted]: ApplicantState.submitted,
  [ApplicantState.withExpert]: ApplicantState.withExpert,
}