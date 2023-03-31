import { Component, Input } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { ToggleMenuAction } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { IMenuOption } from '@shared/models/menu';

@Component({
  selector: 'app-side-nav-item',
  templateUrl: './side-nav-item.component.html',
  styleUrls: ['./side-nav-item.component.scss'],
})
export class SideNavItemComponent {
  @Input() item: IMenuOption;
  @Input() level: number = 0;
  @Input() expanded: boolean = true;
  @Input() disabled: boolean = false;
  deep: number[];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.deep = Array.from(Array(this.level).keys());
  }

  toggleMenu() {
    this.store.dispatch(new ToggleMenuAction());
  }

  optionAction(option: IMenuOption) {
    if (this.disabled) {
      return;
    }
    if (this.expanded === false) {
      this.toggleMenu();
    }
    if (option.command) {
      option.command();
    }
    switch (option.type) {
      case 'single':
        break;
      case 'dropdown':
        option.opened = !option.opened;
        break;
    }
  }
}
