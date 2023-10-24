import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss'],
})
export class SubMenuComponent implements OnDestroy {
  activeIndex: number = 0;

  subMenu$: Subscription;
  menu: IMenu;
  options: IMenuOption[];
  menuTypeSelected = undefined;
  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
    this.subMenu();
  }

  getActiveClass(item: IMenuOption): string {
    return this.router.url.includes(item.rute) ? 'active' : '';
  }

  ngOnDestroy(): void {
    this.subMenu$?.unsubscribe();
  }

  subMenu() {
    this.subMenu$ = this.store
      .select((state) => state.home.subMenus)
      .subscribe((menus) => {
        if (!menus) return;
        this.menu = menus[0];
        this.onChange(this.menu.switchTypeMenu[0].type ?? undefined);
      });
  }

  onChange(type: string) {
    this.menuTypeSelected = type;
    if (!this.menuTypeSelected) {
      this.options = this.menu.options;
      return;
    }
    this.options = this.menu.options.filter(
      (i) => i.menuType === this.menuTypeSelected
    );
  }
}
