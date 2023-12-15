import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';
import { ClassNamePipe } from './pipes/class-name.pipe';
import { RateByUserComponent } from './components/rate-by-user/rate-by-user.component';

@NgModule({
  declarations: [SafePipe, ClassNamePipe, RateByUserComponent],
  imports: [CommonModule],
  exports: [SafePipe, ClassNamePipe],
})
export class AppSharedModule {}
