import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RoleGuard } from '@auth/guards/role.guard';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { PhasesComponent } from './phases/phases.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { PhasesEditComponent } from './phases/phases-edit/phases-edit.component';
import { PhaseLoadComponent } from './phases/phase-load/phase-load.component';
import { PhaseContentComponent } from './phases/phase-content/phase-content.component';
import { PhaseContentViewComponent } from './phases/phase-content/phase-content-view/phase-content-view.component';
import { FormsComponent } from './forms/forms.component';
import { EntrepreneursComponent } from './entrepreneurs/entrepreneurs.component';
import { StartupsComponent } from './startups/startups.component';
import { InvestorsComponent } from './investors/investors.component';
import { ExpertsComponent } from './experts/experts.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementLoadComponent } from './announcements/announcement-load/announcement-load.component';
import { AnnouncementEditComponent } from './announcements/announcement-edit/announcement-edit.component';
import { PhaseHoursConfigComponent } from './phases/phase-hours-config/phase-hours-config.component';
import { PhaseEventsComponent } from './phases/phase-events/phase-events.component';
import { BusinessesComponent } from './businesses/businesses.component';
import { ApplicantsComponent } from './announcements/applicants/applicants.component';
import { PhaseExpertsComponent } from './phases/phase-experts/phase-experts.component';
import { PhaseStartupsComponent } from './phases/phase-startups/phase-startups.component';
import { CommunitiesComponent } from './communities/communities.component';
import { SiteManagementComponent } from './site-management/site-management.component';
import { SiteServicesManagementComponent } from './site-management/site-services-management/site-services-management.component';
import { ValidateParticipationComponent } from './phases/phase-events/validate-participation/validate-participation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'admin',
        canMatch: [RoleGuard],
        data: {
          roles: [ValidRoles.admin, ValidRoles.superAdmin],
        },
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'forms',
        component: FormsComponent,
      },
      {
        path: 'entrepreneurs',
        component: EntrepreneursComponent,
      },
      {
        path: 'businesses',
        component: BusinessesComponent,
      },
      {
        path: 'startups',
        component: StartupsComponent,
      },
      {
        path: 'investors',
        component: InvestorsComponent,
      },
      {
        path: 'experts',
        component: ExpertsComponent,
      },
      {
        path: 'communities',
        component: CommunitiesComponent,
      },
      {
        path: 'site_management',
        children: [
          {
            path: '',
            component: SiteManagementComponent,
          },
          {
            path: ':id',
            component: SiteServicesManagementComponent,
          },
        ],
      },
      {
        path: 'participation/:id',
        component: ValidateParticipationComponent,
      },
      {
        path: 'announcements',
        children: [
          {
            path: '',
            component: AnnouncementsComponent,
          },
          {
            path: ':id',
            component: AnnouncementLoadComponent,
            children: [
              {
                path: 'edit',
                component: AnnouncementEditComponent,
              },
              {
                path: 'applicants/:state',
                component: ApplicantsComponent,
              },
            ],
          },
        ],
      },
      {
        // TODO: Add guards or modules if required
        path: 'phases',
        children: [
          {
            path: '',
            component: PhasesComponent,
          },
          {
            path: 'config',
            component: PhasesConfigComponent,
          },
          {
            path: ':id',
            component: PhaseLoadComponent,
            children: [
              {
                path: 'edit',
                component: PhasesEditComponent,
              },
              {
                path: 'content',
                children: [
                  {
                    path: '',
                    component: PhaseContentComponent,
                  },
                  {
                    path: ':idContent',
                    component: PhaseContentViewComponent,
                  },
                ],
              },
              {
                path: 'bag-hours',
                component: PhaseHoursConfigComponent,
              },
              {
                path: 'events',
                component: PhaseEventsComponent,
              },
              {
                path: 'experts',
                component: PhaseExpertsComponent,
              },
              {
                path: 'startups',
                component: PhaseStartupsComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
