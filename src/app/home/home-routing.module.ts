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
import { ResponsiblesComponent } from './responsibles/responsibles.component';

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
        path: 'startups',
        component: StartupsComponent,
      },
      {
        path: 'investors',
        component: InvestorsComponent,
      },
      {
        path: 'responsibles',
        component: ResponsiblesComponent,
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
                component: PhaseContentComponent,
                children: [
                  {
                    path: ':idContent',
                    component: PhaseContentViewComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
