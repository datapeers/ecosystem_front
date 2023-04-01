import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faTh,
  faCog,
  faLifeRing,
  faQuestionCircle,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '@home/home.service';
import { ToggleMenuAction } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { ToastService } from '@shared/services/toast.service';
import { MenuItem } from 'primeng/api';
import {
  debounceTime,
  filter,
  Observable,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {
  items: MenuItem[];
  user: any;
  user$: Subscription;

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

  onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  overlayVisible = false;
  overlayLoading = true;
  menuOverlay = [];
  constructor(private store: Store<AppState>, public auth: AuthService) {
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
    this.user$?.unsubscribe();
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.user$ = this.store
      .select((store) => store.auth.user)
      .subscribe(async (user) => {
        if (!user) return;
        const userStore = user;
        //  this.user = new User(userStore);
        // this.rolUser = this.user.get_rol();
      });
    this.items = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: ['/perfil'],
      },
      {
        label: 'Salir',
        icon: 'pi pi-sign-out',
        command: () => {
          this.auth.signOut();
        },
      },
    ];
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
