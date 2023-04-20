import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RoleGuard } from '@auth/guards/role.guard';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';
import { PhasesComponent } from './phases/phases.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { PhasesEditComponent } from './phases/phases-edit/phases-edit.component';
import { PhaseLoadComponent } from './phases/phase-load/phase-load.component';

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
        // TODO: Add guards or modules if required
        path: 'phases',
        children: [
          {
            path: "",
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
              }
            ]
          },
        ]
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
