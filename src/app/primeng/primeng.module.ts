import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { KnobModule } from 'primeng/knob';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ColorPickerModule } from 'primeng/colorpicker';
@NgModule({
  declarations: [],
  exports: [
    AccordionModule,
    ButtonModule,
    AutoCompleteModule,
    CascadeSelectModule,
    CheckboxModule,
    ChipsModule,
    DropdownModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    KnobModule,
    PasswordModule,
    RadioButtonModule,
    SelectButtonModule,
    SliderModule,
    TriStateCheckboxModule,
    ToggleButtonModule,
    SplitButtonModule,
    TableModule,
    DataViewModule,
    DividerModule,
    CardModule,
    TabViewModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DialogModule,
    DynamicDialogModule,
    OverlayPanelModule,
    SidebarModule,
    TooltipModule,
    ScrollPanelModule,
    MessagesModule,
    ToastModule,
    MenuModule,
    AvatarModule,
    ProgressSpinnerModule,
    CalendarModule,
    FileUploadModule,
    ColorPickerModule,
  ],
  imports: [CommonModule],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class PrimengModule {}
