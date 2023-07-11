import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UsersPanelComponent } from './users-panel/users-panel.component';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvitationsComponent } from './invitations/invitations.component';
import { RolesComponent } from './roles/roles.component';
import { UsersAssignComponent } from './users-assign/users-assign.component';


@NgModule({
  declarations: [
    AdminComponent,
    UsersPanelComponent,
    InvitationsComponent,
    RolesComponent,
    UsersAssignComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimengModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
