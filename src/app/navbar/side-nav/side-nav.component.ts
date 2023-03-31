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
import {
  Subscription,
  combineLatest,
  filter,
  first,
  firstValueFrom,
  map,
} from 'rxjs';
import { cloneDeep } from 'lodash';
import { SetMenuAction, ToggleMenuAction } from '@home/store/home.actions';
import { getDeepestData } from '@shared/functions/router.utils';
import { User } from '@shared/models/user';
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
    this.updateMenu();
  }
  ngOnDestroy(): void {
    this.menuExpanded$?.unsubscribe();
    this.menu$?.unsubscribe();
    this.router$?.unsubscribe();
  }

  menuSub() {
    this.menu$ = this.store
      .select((store) => store.home.menu)
      .subscribe((menu) => {
        this.menu = cloneDeep(menu);
        console.log(this.menu);
      });
  }

  routeSub() {
    //Router subscription
    this.router$ = this.router.events.subscribe(async (routerEvent) => {
      //On navigation start check if the menu is expanded and if the screen is small enough to assume
      //That the expanded menu uses all the window width, if thats the case toggle the menu state
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

      //On navigation end check if the menu should be updated based on the data found on the routes
      if (routerEvent instanceof NavigationEnd) {
        this.updateMenu();
      }
    });

    //Menu expanded subscription
    this.menuExpanded$ = this.store
      .select((storeState) => storeState.home.menuExpanded)
      .subscribe((isExpanded) => {
        this.menuExpanded = isExpanded;
      });
  }

  updateMenu() {
    const menuType = getDeepestData(this.routeOpt.snapshot.root, 'menu');
    console.log(this.routeOpt.snapshot.root, menuType);
    if (this.lastMenu !== menuType) {
      console.log('b');
      this.lastMenu = menuType;
      this.setMenu(menuType);
    }
  }

  toggleMenu() {
    this.store.dispatch(new ToggleMenuAction());
  }

  return() {
    this.router.navigate(this.menu.returnPath, {
      queryParams: this.menu.returnQueryParamsRute,
    });
  }

  async setMenu(type: string) {
    this.sub$?.unsubscribe();
    console.log('c');
    switch (type) {
      case 'edit':
        //Space name can change here thats why we subscribe to the observables
        //But the truth is that for this application only the space may change during edit
        //Any change in the user requires this component to be destroyer
        //and changes in space require to load another case of menu before that
        // this.sub$ = this.onUserAndSpace().subscribe(([user, space]) => {
        //   const editMenu = this.espaciosService.get_menu_space(
        //     space,
        //     user.get_rol()
        //   );
        //   this.store.dispatch(new SetMenuAction(editMenu));
        // });
        break;
      case 'manage':
        // this.sub$ = this.onUserAndSpace().subscribe(([user, space]) => {
        //   const manageMenu = this.espaciosService.get_menu_manage_space(
        //     space,
        //     user.get_rol()
        //   );
        //   if (
        //     !manageMenu.options.some((opt) => opt.rute.length === 2) &&
        //     this.router.url.includes('dashboard')
        //   ) {
        //     this.router.navigate(manageMenu.options[0].rute, {
        //       queryParams: manageMenu.options[0].queryParamsRute,
        //     });
        //   }
        //   this.store.dispatch(new SetMenuAction(manageMenu));
        // });
        break;
      case 'content':
        // this.sub$ = this.onUserAndSpace().subscribe(([user, space]) => {
        //   const contentMenu = this.espaciosService.get_menu_space_content(
        //     space,
        //     user
        //   );
        //   this.store.dispatch(new SetMenuAction(contentMenu));
        // });
        break;
      default:
        //The user only changes when leaving the home component which at the moment destroys this component first
        //Thats why we use a promise instead
        console.log('d');
        this.onUser().then(async (userStore) => {
          const user = new User(userStore);
          const homeMenu = await this.homeService.getDefaultHomeMenu(user);
          console.log('e', homeMenu);
          this.store.dispatch(new SetMenuAction(homeMenu));
        });
        break;
    }
  }

  async onUser() {
    return firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    );
  }
}
