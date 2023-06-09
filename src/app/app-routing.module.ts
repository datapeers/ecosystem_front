import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { RoleGuard } from '@auth/guards/role.guard';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { LandingComponent } from './public/landing/landing.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'landing/:id', component: LandingComponent },
  {
    path: 'home',
    canMatch: [AuthGuard, RoleGuard],
    data: {
      roles: [
        ValidRoles.admin,
        ValidRoles.superAdmin,
        ValidRoles.expert,
        ValidRoles.teamCoach,
        ValidRoles.host,
        // ValidRoles.investor,
      ],
    },
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'user',
    canMatch: [AuthGuard, RoleGuard],
    data: {
      roles: [ValidRoles.user],
    },
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
];

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
