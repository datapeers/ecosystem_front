import { Component, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBars, faTh, faCog, faLifeRing, faQuestionCircle, faBell, } from '@fortawesome/free-solid-svg-icons';
import { ToggleMenuAction } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { User } from '@shared/models/auth/user';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { ProtectedMenuItem } from '@shared/models/primeng/protected-menu-item';
import { debounceTime, filter, Observable, Subject, takeUntil, } from 'rxjs';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {
  availableItems: ProtectedMenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: ['/home/profile'],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      routerLink: ['/home/admin'],
      roles: [ ValidRoles.superAdmin, ValidRoles.admin ]
    },
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => {
        this.auth.signOut();
      },
    },
  ];
  
  items: ProtectedMenuItem[];
  user: User;

  faBars = faBars as IconProp;
  faTh = faTh as IconProp;
  faCog = faCog as IconProp;
  faLifeRing = faLifeRing as IconProp;
  faQuestionCircle = faQuestionCircle as IconProp;
  faBell = faBell as IconProp;

  menu$: Observable<IMenu>;

  @ViewChild('rightmenu') rightmenu;

  searchValue: string;
  search$: Subject<String> = new Subject<String>();

  onDestroy$: Subject<void> = new Subject();
  overlayVisible = false;
  overlayLoading = true;
  menuOverlay = [];
  constructor(
    private readonly store: Store<AppState>,
    private readonly auth: AuthService,
  ) {
    this.menu$ = this.store.select((storeState) => storeState.home.menu);
    this.search$
      .pipe(
        debounceTime(500),
        filter((v) => !!v?.trim()),
        takeUntil(this.onDestroy$)
      )
      .subscribe((value: string) => {
        if (!value) {
          this.clearSearch();
          return;
        }
      });
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.store
      .select((store) => store.auth.user)
      .pipe(
        filter(user => !!user), // Avoid null and undefined values
        takeUntil(this.onDestroy$)
      )
      .subscribe(async (user) => {
        this.user = user;
        this.items = this.availableItems.filter(item => {
          return item.roles?.some(rol => user.roles.includes(rol)) ?? true;
        })
      });
  }

  toggleMenu() {
    this.store.dispatch(new ToggleMenuAction());
  }

  goTo(option: IMenuOption) {
    option.command();
    this.clearSearch();
  }

  clearSearch() {
    this.menuOverlay = [];
    this.overlayLoading = false;
    this.overlayVisible = false;
    this.searchValue = null;
  }
}