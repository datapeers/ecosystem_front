import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { IMenuOption } from '@shared/models/menu';
import { BehaviorSubject, Subject, combineLatest, filter, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-side-nav-route-icon',
  templateUrl: './side-nav-route-icon.component.html',
  styleUrls: ['./side-nav-route-icon.component.scss']
})
export class SideNavRouteIconComponent implements OnDestroy {
  activeMenuOption?: IMenuOption;
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private router: Router, 
    private readonly store: Store<AppState>
  ) {
    const routeChange = new BehaviorSubject(null);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((evt) => {
        routeChange.next(evt);
      });

    const menu = this.store.select(state => state.home.menu);
    const otherMenu = this.store.select(state => state.home.otherMenu);
    const subMenus = this.store.select(state => state.home.subMenus);
    const combinedMenus = combineLatest([ menu, otherMenu, subMenus ])
      .pipe(
        map(([menu, otherMenu, subMenus]) => [ menu, otherMenu, ...(subMenus ?? []) ]),
        map(menus => menus.filter(menu => menu !== null)),
        filter(menus => menus.length > 0)
      );
    combineLatest([combinedMenus, routeChange])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([menus, _routerEvent]) => {
        this.activeMenuOption = menus.flatMap(menu => menu.options).find(option => this.router.isActive(option.rute, true) );
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
