import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PrimengModule } from '../primeng/primeng.module';
import { AvatarUploaderModule } from '@shared/components/form/avatar-uploader/avatar-uploader.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationModule } from '../navbar/navigation.module';
import { StorageModule } from '../shared/storage/storage.module';
import { AppSharedModule } from '@shared/app-shared.module';
import { PhasesComponent } from './phases/phases.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';
import { PhasesCreatorComponent } from './phases/phases-creator/phases-creator.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { PhasesEditComponent } from './phases/phases-edit/phases-edit.component';
import { PhaseLoadComponent } from './phases/phase-load/phase-load.component';
import { NgxTinymceModule } from 'ngx-tinymce';
import { PhaseContentComponent } from './phases/phase-content/phase-content.component';
import { PhaseContentCreatorComponent } from './phases/phase-content/phase-content-creator/phase-content-creator.component';
import { PhaseContentViewComponent } from './phases/phase-content/phase-content-view/phase-content-view.component';
import { EntrepreneursComponent } from './entrepreneurs/entrepreneurs.component';
import { StartupsComponent } from './startups/startups.component';
import { FormsComponent } from './forms/forms.component';
import { InvestorsComponent } from './investors/investors.component';
import { PhaseContentResourceCreatorComponent } from './phases/phase-content/phase-content-resource-creator/phase-content-resource-creator.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementsCreatorComponent } from './announcements/announcements-creator/announcements-creator.component';
import { AnnouncementEditComponent } from './announcements/announcement-edit/announcement-edit.component';
import { AnnouncementLoadComponent } from './announcements/announcement-load/announcement-load.component';
import { PhaseHoursConfigComponent } from './phases/phase-hours-config/phase-hours-config.component';
import { PhaseEventsComponent } from './phases/phase-events/phase-events.component';
import { DynamicTableModule } from '@shared/components/dynamic-table/dynamic-table.module';
import { ExpertsComponent } from './experts/experts.component';
import { BusinessesComponent } from './businesses/businesses.component';
import { ApplicantsComponent } from './announcements/applicants/applicants.component';
import { PhaseExpertsComponent } from './phases/phase-experts/phase-experts.component';
import { PhaseStartupsComponent } from './phases/phase-startups/phase-startups.component';
import { ApplicantStateEditComponent } from './announcements/applicants/applicant-state-edit/applicant-state-edit.component';
import { DatefilterComponent } from '@shared/components/datefilter/datefilter.component';
import { ActaComponent } from './phases/phase-events/acta/acta.component';
import { CommunitiesComponent } from './communities/communities.component';
import { SiteManagementComponent } from './site-management/site-management.component';
import { SiteServicesManagementComponent } from './site-management/site-services-management/site-services-management.component';
import { ValidateParticipationComponent } from './phases/phase-events/validate-participation/validate-participation.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrViewComponent } from '@shared/components/qr-view/qr-view.component';
import { AssignHoursComponent } from './phases/phase-hours-config/assign-hours/assign-hours.component';
import { PhaseEvaluationsComponent } from './phases/phase-evaluations/phase-evaluations.component';
import { EvaluationTablesComponent } from './phases/phase-evaluations/evaluation-tables/evaluation-tables.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TagModule } from 'primeng/tag';
import { ToolkitComponent } from './toolkit/toolkit.component';
import { PhaseHomeworksComponent } from './phases/phase-homeworks/phase-homeworks.component';
import { PhaseHomeworkTableComponent } from './phases/phase-homeworks/phase-homework-table/phase-homework-table.component';
import { ContentsComponent } from './contents/contents.component';
import { AssignStartupsHoursComponent } from './phases/phase-hours-config/assign-startups-hours/assign-startups-hours.component';
import { EventCreatorComponent } from './phases/phase-events/event-creator/event-creator.component';
import { ListParticipationComponent } from './phases/phase-events/list-participation/list-participation.component';
import { RatingEventComponent } from './calendar/rating-event/rating-event.component';
import { HelpdeskComponent } from './helpdesk/helpdesk.component';
import { RouteComponent } from './route/route.component';
import { StagesComponent } from './phases/stages/stages.component';
import { IconsModule } from '../icons/icons.module';
import { InitComponent } from './init/init.component';
import { ResourceCardComponent } from '../shared/components/resource-card/resource-card.component';
import { StartupProfileComponent } from './startup-profile/startup-profile.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { RouteStageDescriptionComponent } from './route-stage-description/route-stage-description.component';
import { ApplicantSelectDialogComponent } from './announcements/applicants/applicant-select-dialog/applicant-select-dialog.component';
@NgModule({
  declarations: [
    HomeComponent,
    PhasesComponent,
    LoadingComponent,
    PhasesConfigComponent,
    PhasesCreatorComponent,
    ProfileComponent,
    PhasesEditComponent,
    PhaseLoadComponent,
    PhaseContentComponent,
    PhaseContentCreatorComponent,
    PhaseContentViewComponent,
    EntrepreneursComponent,
    StartupsComponent,
    FormsComponent,
    InvestorsComponent,
    PhaseContentResourceCreatorComponent,
    AnnouncementsComponent,
    AnnouncementsCreatorComponent,
    AnnouncementEditComponent,
    AnnouncementLoadComponent,
    PhaseHoursConfigComponent,
    PhaseEventsComponent,
    ExpertsComponent,
    ApplicantsComponent,
    BusinessesComponent,
    PhaseExpertsComponent,
    PhaseStartupsComponent,
    ApplicantStateEditComponent,
    DatefilterComponent,
    ActaComponent,
    CommunitiesComponent,
    SiteManagementComponent,
    SiteServicesManagementComponent,
    ValidateParticipationComponent,
    QrViewComponent,
    AssignHoursComponent,
    InitComponent,
    PhaseEvaluationsComponent,
    EvaluationTablesComponent,
    CalendarComponent,
    ToolkitComponent,
    PhaseHomeworksComponent,
    PhaseHomeworkTableComponent,
    ContentsComponent,
    AssignStartupsHoursComponent,
    EventCreatorComponent,
    ListParticipationComponent,
    RatingEventComponent,
    HelpdeskComponent,
    RouteComponent,
    StagesComponent,
    ResourceCardComponent,
    StartupProfileComponent,
    ConfigurationComponent,
    RouteStageDescriptionComponent,
    ApplicantSelectDialogComponent,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    CdkMenuModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    PrimengModule,
    FontAwesomeModule,
    AvatarUploaderModule,
    TagModule,
    DynamicTableModule,
    NavigationModule,
    NgxTinymceModule.forRoot({
      baseURL: '/assets/tinymce/',
    }),
    StorageModule,
    AppSharedModule,
    QRCodeModule,
    FullCalendarModule,
    IconsModule,
  ],
})
export class HomeModule {}
