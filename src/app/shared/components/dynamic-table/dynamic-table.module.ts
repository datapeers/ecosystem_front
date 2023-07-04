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
import { BusinessSelectTableComponent } from './table-select-dialog/providers/business-select-table/business-select-table.component';
import { TableSelectDialogComponent } from './table-select-dialog/table-select-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { EntrepreneurSelectTableComponent } from './table-select-dialog/providers/entrepreneur-select-table/entrepreneur-select-table.component';
import { StartupSelectTableComponent } from './table-select-dialog/providers/startup-select-table/startup-select-table.component';


@NgModule({
  declarations: [
    DynamicTableComponent,
    TableConfigComponent,
    ConfigSelectorComponent,
    TableSelectDialogComponent,
    BusinessSelectTableComponent,
    EntrepreneurSelectTableComponent,
    StartupSelectTableComponent,
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
  ],
  providers: [ConfirmationService]
})
export class DynamicTableModule { }
