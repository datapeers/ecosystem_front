import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '@auth/guards/auth.guard';
import { RoleGuard } from '@auth/guards/role.guard';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'admin',
        canMatch: [AuthGuard, RoleGuard],
        data: {
          roles: [ValidRoles.admin, ValidRoles.superAdmin]
        },
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
      },
    ]
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
