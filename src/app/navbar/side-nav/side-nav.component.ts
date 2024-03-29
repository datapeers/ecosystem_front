import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { HomeService } from '@home/home.service';
import { Store } from '@ngrx/store';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SetMenuAction, ToggleMenuAction } from '@home/store/home.actions';
import { User } from '@auth/models/user';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { fadeInOut } from '../helper';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SideNavComponent implements OnInit, OnDestroy {
  menu: IMenu;
  menu$: Subscription;
  menuExpanded$: Subscription;
  menuExpanded: boolean;
  router$: Subscription;
  lastMenu?: string = 'noLoad';
  screenWith = 0;
  multiple: boolean = true;

  subscriptions$: Subscription[] = [];
  sub$: Subscription;
  user: User;

  // ? extra menu icons
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  constructor(
    private router: Router,
    public routeOpt: ActivatedRoute,
    private store: Store<AppState>,
    private homeService: HomeService
  ) {
    this.menuSub();
    this.routeSub();
  }

  ngOnInit() {
    this.setMainMenu();
  }

  ngOnDestroy(): void {
    this.menuExpanded$?.unsubscribe();
    this.menu$?.unsubscribe();
    this.router$?.unsubscribe();
  }

  menuSub() {
    this.menu$ = this.store
      .select((store) => store.home)
      .subscribe((homeStore) => {
        this.menu = homeStore.otherMenu
          ? cloneDeep(homeStore.otherMenu)
          : cloneDeep(homeStore.menu);
        // console.log(this.menu);
      });
  }

  routeSub() {
    // Router subscription
    this.router$ = this.router.events.subscribe(async (routerEvent) => {
      // On navigation start check if the menu is expanded and if the screen is small enough to assume
      // That the expanded menu uses all the window width, if thats the case toggle the menu state
      if (routerEvent instanceof NavigationStart) {
        const menuExpanded = await firstValueFrom(
          this.store
            .select((storeState) => storeState.home.menuExpanded)
            .pipe(first())
        );
        if (menuExpanded && window.innerWidth <= 600) this.toggleMenu();
      }
    });

    //Menu expanded subscription
    this.menuExpanded$ = this.store
      .select((storeState) => storeState.home.menuExpanded)
      .subscribe((isExpanded) => {
        this.menuExpanded = isExpanded;
      });
  }

  setMainMenu() {
    this.onUser().then(async (userStore) => {
      const user = new User(userStore);
      const homeMenu = await this.homeService.getDefaultHomeMenu(user);
      this.store.dispatch(new SetMenuAction(homeMenu));
    });
  }

  toggleMenu() {
    this.store.dispatch(new ToggleMenuAction());
  }

  return() {
    this.router.navigate(this.menu.returnPath, {
      queryParams: this.menu.returnQueryParamsRute,
    });
  }

  async onUser() {
    return firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    );
  }

  handleClick(item: IMenuOption) {
    this.shrinkItems(item);
    item.opened = !item.opened;
  }

  getActiveClass(item: IMenuOption): string {
    return this.router.url.includes(item.rute) ? '' : '';
  }

  shrinkItems(item: IMenuOption) {
    if (!this.multiple) {
      for (const modelItem of this.menu.options) {
        if (item !== modelItem && modelItem.opened) {
          modelItem.opened = false;
        }
      }
    }
  }
}
