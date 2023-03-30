import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'primeng/accordion'; //accordion and accordion tab
import { ButtonModule } from 'primeng/button'; //buttons
@NgModule({
  declarations: [],
  exports: [AccordionModule, ButtonModule],
  imports: [CommonModule],
})
export class PrimengModule {}
