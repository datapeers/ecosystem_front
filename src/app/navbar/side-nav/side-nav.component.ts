import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { HomeService } from '@home/home.service';
import { Store } from '@ngrx/store';
import { IMenu } from '@shared/models/menu';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SetMenuAction, ToggleMenuAction } from '@home/store/home.actions';
import { getDeepestData } from '@shared/functions/router.utils';
import { User } from '@auth/models/user';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  menu: IMenu;
  menu$: Subscription;
  menuExpanded$: Subscription;
  menuExpanded: boolean;
  router$: Subscription;
  lastMenu?: string = 'noLoad';

  subscriptions$: Subscription[] = [];
  sub$: Subscription;
  user: User;

  // ? extra menu icons
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  // TODO: Move scroll listeners to another component
  disabled: boolean = false;
  isDragging: boolean = false;
  pointerDown: boolean = false;
  startY: number;
  startTop: number;
  documentListeners = [];

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
        if (menuExpanded) {
          if (window.innerWidth <= 600) {
            this.toggleMenu();
          }
        }
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
}
