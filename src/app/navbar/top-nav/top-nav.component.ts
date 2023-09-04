import { Component, Input, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';

import { ToggleMenuAction } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { ProtectedMenuItem } from '@shared/models/primeng/protected-menu-item';
import {
  debounceTime,
  filter,
  first,
  firstValueFrom,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { Startup } from '@shared/models/entities/startup';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {
  // availableItems: ProtectedMenuItem[] = [
  //   {
  //     label: 'Perfil',
  //     icon: 'pi pi-user',
  //     routerLink: ['/home/profile'],
  //   },
  //   {
  //     label: 'Usuarios',
  //     icon: 'pi pi-users',
  //     routerLink: ['/home/admin'],
  //     roles: [ValidRoles.superAdmin, ValidRoles.admin],
  //   },
  //   {
  //     label: 'Salir',
  //     icon: 'pi pi-sign-out',
  //     command: () => {
  //       this.auth.signOut();
  //     },
  //   },
  // ];

  items: ProtectedMenuItem[];
  user: User;
  profileDoc;
  startup: Startup;

  menu$: Observable<IMenu>;

  @ViewChild('rightmenu') rightmenu;

  searchValue: string;
  search$: Subject<String> = new Subject<String>();

  onDestroy$: Subject<void> = new Subject();
  overlayVisible = false;
  overlayLoading = true;
  menuOverlay = [];

  @Input() menuExpanded: boolean = true;
  @Input() screenWith = 0;

  rolName = '';
  viewUserBoard = false;

  constructor(
    private readonly store: Store<AppState>,
    private readonly auth: AuthService
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
        filter((user) => !!user), // Avoid null and undefined values
        takeUntil(this.onDestroy$)
      )
      .subscribe(async (user) => {
        this.user = user;
        this.setUserVars();
      });
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

  toggleMenu() {
    this.store.dispatch(new ToggleMenuAction());
  }

  getHeadClass() {
    let styleClass = '';
    if (this.menuExpanded && this.screenWith > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  showSidenavButton() {
    return this.screenWith > 768 ? true : false;
  }

  async setUserVars() {
    if (this.user.isUser) {
      this.profileDoc = await firstValueFrom(
        this.store
          .select((store) => store.auth.profileDoc)
          .pipe(first((i) => i !== null))
      );
      console.log(this.profileDoc);
      this.startup = this.profileDoc.startups[0];
      const currentBatch = await firstValueFrom(
        this.store
          .select((store) => store.home.currentBatch)
          .pipe(first((i) => i !== null))
      );
    } else {
      this.rolName = this.user.rolName;
    }
  }
}
