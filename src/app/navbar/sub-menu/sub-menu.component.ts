import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent {
  subMenus$: Observable<IMenu[]>;
  activeIndex: number = 0;
  
  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) {
    this.subMenus$ = this.store.select(state => state.home.subMenus);
  }

  getActiveClass(item: IMenuOption): string {
    return this.router.url.includes(item.rute) ? 'active' : '';
  }
}
