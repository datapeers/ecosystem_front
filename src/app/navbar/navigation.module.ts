import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TopNavComponent } from './top-nav/top-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { StorageModule } from '@shared/storage/storage.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SideNavItemComponent } from './side-nav/side-nav-item/side-nav-item.component';
import { SublevelMenuComponent } from './side-nav/sublevel-menu.component';



@NgModule({
  declarations: [
    TopNavComponent,
    SideNavComponent,
    SideNavItemComponent,
    SublevelMenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule,
    FontAwesomeModule,
    StorageModule,
  ],
  exports: [
    TopNavComponent,
    SideNavComponent,
  ]
})
export class NavigationModule { }
