import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ZoomComponent } from './integrations/zoom/zoom.component';
import { EmailValidatorDirective } from '@shared/pipes/email-validator.directive';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'redirect_zoom',
    component: ZoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
