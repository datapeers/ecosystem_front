import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { RoleGuard } from '@auth/guards/role.guard';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  {
    path: 'home',
    canMatch: [AuthGuard, RoleGuard],
    data: {
      roles: [ValidRoles.admin, ValidRoles.superAdmin, ValidRoles.responsible, ValidRoles.investor]
    },
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'user',
    canMatch: [AuthGuard, RoleGuard],
    data: {
      roles: [ValidRoles.user]
    },
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
];

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
