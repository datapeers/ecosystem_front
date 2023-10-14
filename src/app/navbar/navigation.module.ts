import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TopNavComponent } from './top-nav/top-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { StorageModule } from '@shared/storage/storage.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SublevelMenuComponent } from './side-nav/sublevel-menu.component';
import { IconsModule } from '../icons/icons.module';
import { AppSharedModule } from '@shared/app-shared.module';
import { DividerTextComponent } from '@shared/components/divider-text/divider-text.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SideNavRouteIconComponent } from './side-nav-route-icon/side-nav-route-icon.component';

@NgModule({
  declarations: [
    TopNavComponent,
    SideNavComponent,
    SublevelMenuComponent,
    DividerTextComponent,
    NotificationsComponent,
    SideNavRouteIconComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule,
    IconsModule,
    FontAwesomeModule,
    StorageModule,
    AppSharedModule,
  ],
  exports: [TopNavComponent, SideNavComponent],
})
export class NavigationModule {}
