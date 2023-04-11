import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PrimengModule } from '../primeng/primeng.module';
import { SideNavItemComponent } from '../navbar/side-nav/side-nav-item/side-nav-item.component';
import { SideNavComponent } from '../navbar/side-nav/side-nav.component';
import { TopNavComponent } from '../navbar/top-nav/top-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PhasesComponent } from './phases/phases.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PhasesConfigComponent } from './phases/phases-config/phases-config.component';

@NgModule({
  declarations: [
    HomeComponent,
    TopNavComponent,
    SideNavComponent,
    SideNavItemComponent,
    PhasesComponent,
    LoadingComponent,
    PhasesConfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    PrimengModule,
    FontAwesomeModule,
  ],
})
export class HomeModule {}