import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { RoleGuard } from '@auth/guards/role.guard';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';
import { PhasesComponent } from './phases/phases.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';

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
        path: 'phases',
        component: PhasesComponent,
      },
      {
        path: 'phases/config',
        component: PhasesConfigComponent,
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
