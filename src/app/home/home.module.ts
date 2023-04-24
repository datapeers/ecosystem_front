import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PrimengModule } from '../primeng/primeng.module';
import { SideNavItemComponent } from '../navbar/side-nav/side-nav-item/side-nav-item.component';
import { SideNavComponent } from '../navbar/side-nav/side-nav.component';
import { TopNavComponent } from '../navbar/top-nav/top-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhasesComponent } from './phases/phases.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';
import { PhasesCreatorComponent } from './phases/phases-creator/phases-creator.component';
import { ProfileComponent } from '@shared/components/profile/profile.component';
import { PhasesEditComponent } from './phases/phases-edit/phases-edit.component';
import { PhaseLoadComponent } from './phases/phase-load/phase-load.component';
import { SafePipe } from '@shared/pipe/safe.pipe';
import { NgxTinymceModule } from 'ngx-tinymce';

@NgModule({
  declarations: [
    HomeComponent,
    TopNavComponent,
    SideNavComponent,
    SideNavItemComponent,
    PhasesComponent,
    LoadingComponent,
    PhasesConfigComponent,
    PhasesCreatorComponent,
    ProfileComponent,
    PhasesEditComponent,
    PhaseLoadComponent,
    SafePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    PrimengModule,
    FontAwesomeModule,
    NgxTinymceModule.forRoot({
      baseURL: '/assets/tinymce/',
    }),
  ],
})
export class HomeModule {}
