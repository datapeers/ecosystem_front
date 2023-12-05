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
import { PermissionsComponent } from './permissions/permissions.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { IconsModule } from '../icons/icons.module';
import { ZoomComponent } from './integrations/zoom/zoom.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

@NgModule({
  declarations: [
    AdminComponent,
    UsersPanelComponent,
    InvitationsComponent,
    RolesComponent,
    UsersAssignComponent,
    PermissionsComponent,
    IntegrationsComponent,
    ZoomComponent,
    TermsOfUseComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimengModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
  ],
})
export class AdminModule {}
