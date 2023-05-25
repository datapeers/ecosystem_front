import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableConfig } from '../models/table-config';

@Component({
  selector: 'app-config-selector',
  templateUrl: './config-selector.component.html',
  styleUrls: ['./config-selector.component.scss']
})
export class ConfigSelectorComponent {
  tabIndex: number = 0;
  @Input() options: TableConfig[] = [];
  @Input() config: TableConfig;
  @Output() configChange: EventEmitter<TableConfig> = new EventEmitter();
  @Output() onAdd: EventEmitter<string> = new EventEmitter();
  @Output() onRemove: EventEmitter<string> = new EventEmitter();

  showNewConfigDialog: boolean = false;
  newConfigName: string = '';

  handleClose(evt: { close?: () => {}; originalEvent: PointerEvent | TouchEvent; index: number; }) {
    const configToDelete = this.options[evt.index];
    this.onRemove.emit(configToDelete._id);
    //TODO: Handle tab close
  }
  
  handleTabChange(evt: { originalEvent: PointerEvent | TouchEvent; index: number; }) {
    if(evt.index === this.options.length) {
      this.showNewConfigDialog = true;
      return;
    }
    const selectedConfig = this.options[evt.index];
    this.configChange.next(selectedConfig);
  }

  addNewConfig() {
    this.showNewConfigDialog = false;
    this.onAdd.emit(this.newConfigName);
  }
}
