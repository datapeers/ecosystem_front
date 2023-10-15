import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';
import { ClassNamePipe } from './pipes/class-name.pipe';

@NgModule({
  declarations: [SafePipe, ClassNamePipe],
  imports: [CommonModule],
  exports: [SafePipe, ClassNamePipe],
})
export class AppSharedModule {}
