import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { OrderListModule } from 'primeng/orderlist';
import { DragDropModule } from 'primeng/dragdrop';
import { TableConfigComponent } from './table-config/table-config.component';
import { InputTextModule } from 'primeng/inputtext';
import { ConfigSelectorComponent } from './config-selector/config-selector.component';


@NgModule({
  declarations: [
    DynamicTableComponent,
    TableConfigComponent,
    ConfigSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TabViewModule,
    DialogModule,
    MenuModule,
    TieredMenuModule,
    DropdownModule,
    CalendarModule,
    OrderListModule,
    DragDropModule,
  ],
  exports: [
    DynamicTableComponent
  ]
})
export class DynamicTableModule { }
