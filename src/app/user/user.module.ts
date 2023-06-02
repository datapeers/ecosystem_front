import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { NavigationModule } from '../navbar/navigation.module';
import { PrimengModule } from '../primeng/primeng.module';



@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    PrimengModule,
    NavigationModule,
  ]
})
export class UserModule { }
