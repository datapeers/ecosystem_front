import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PrimengModule } from '../primeng/primeng.module';
import { AvatarUploaderModule } from '@shared/components/form/avatar-uploader/avatar-uploader.module';
import { SideNavItemComponent } from '../navbar/side-nav/side-nav-item/side-nav-item.component';
import { SideNavComponent } from '../navbar/side-nav/side-nav.component';
import { TopNavComponent } from '../navbar/top-nav/top-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhasesComponent } from './phases/phases.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';
import { PhasesCreatorComponent } from './phases/phases-creator/phases-creator.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { PhasesEditComponent } from './phases/phases-edit/phases-edit.component';
import { PhaseLoadComponent } from './phases/phase-load/phase-load.component';
import { SafePipe } from '@shared/pipe/safe.pipe';
import { NgxTinymceModule } from 'ngx-tinymce';
import { PhaseContentComponent } from './phases/phase-content/phase-content.component';
import { PhaseContentCreatorComponent } from './phases/phase-content/phase-content-creator/phase-content-creator.component';
import { PhaseContentViewComponent } from './phases/phase-content/phase-content-view/phase-content-view.component';
import { EntrepreneursComponent } from './entrepreneurs/entrepreneurs.component';
import { StartupsComponent } from './startups/startups.component';
import { FormsComponent } from './forms/forms.component';
import { InvestorsComponent } from './investors/investors.component';
import { ResponsiblesComponent } from './responsibles/responsibles.component';
import { GetImagePipe } from '@shared/pipe/get-image.pipe';
import { PhaseContentResourceCreatorComponent } from './phases/phase-content/phase-content-resource-creator/phase-content-resource-creator.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementsCreatorComponent } from './announcements/announcements-creator/announcements-creator.component';
import { AnnouncementEditComponent } from './announcements/announcement-edit/announcement-edit.component';
import { AnnouncementLoadComponent } from './announcements/announcement-load/announcement-load.component';
import { PhaseHoursConfigComponent } from './phases/phase-hours-config/phase-hours-config.component';

@NgModule({
  declarations: [
    HomeComponent,
    TopNavComponent,
    SideNavComponent,
    SideNavItemComponent,
    PhasesComponent,
    LoadingComponent,
    PhasesConfigComponent,
    PhasesCreatorComponent,
    ProfileComponent,
    PhasesEditComponent,
    PhaseLoadComponent,
    SafePipe,
    PhaseContentComponent,
    PhaseContentCreatorComponent,
    PhaseContentViewComponent,
    EntrepreneursComponent,
    StartupsComponent,
    FormsComponent,
    InvestorsComponent,
    ResponsiblesComponent,
    GetImagePipe,
    PhaseContentResourceCreatorComponent,
    AnnouncementsComponent,
    AnnouncementsCreatorComponent,
    AnnouncementEditComponent,
    AnnouncementLoadComponent,
    PhaseHoursConfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    PrimengModule,
    FontAwesomeModule,
    AvatarUploaderModule,
    NgxTinymceModule.forRoot({
      baseURL: '/assets/tinymce/',
    }),
  ],
})
export class HomeModule {}
