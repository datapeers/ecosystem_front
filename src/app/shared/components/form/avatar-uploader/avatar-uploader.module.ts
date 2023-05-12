import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarUploaderComponent } from './avatar-uploader.component';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';



@NgModule({
  declarations: [
    AvatarUploaderComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
  ],
  exports: [
    AvatarUploaderComponent,
  ]
})
export class AvatarUploaderModule { }
