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
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInOut } from '../helper';
import { hexToRgb } from '@shared/utils/hexToRgb';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  animations: [fadeInOut],
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
  returnBtn$: Observable<boolean>;

  @ViewChild('rightmenu') rightmenu;

  searchValue: string;
  search$: Subject<String> = new Subject<String>();

  onDestroy$: Subject<void> = new Subject();

  @Input() menuExpanded: boolean = true;
  @Input() screenWith = 0;

  percentCompleted = 75;
  rolName = '';
  viewUserBoard = false;
  viewNotificationBoard = false;
  viewSearchItem = false;
  colorPhase = '#EA4254';
  constructor(
    private router: Router,
    private readonly store: Store<AppState>,
    private readonly auth: AuthService,
    private _location: Location
  ) {
    this.menu$ = this.store.select((storeState) => storeState.home.menu);
    this.returnBtn$ = this.store.select(
      (storeState) => storeState.home.returnBtn
    );
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
    return true;
    //return this.screenWith > 768 ? true : false;
  }

  async setUserVars() {
    if (this.user.isUser) {
      this.profileDoc = await firstValueFrom(
        this.store
          .select((store) => store.auth.profileDoc)
          .pipe(first((i) => i !== null))
      );

      this.startup = this.profileDoc.startups[0];
      // console.log(this.startup);
      const currentBatch = await firstValueFrom(
        this.store
          .select((store) => store.home.currentBatch)
          .pipe(first((i) => i !== null))
      );
      this.rolName = 'CEO Emprendia';
    } else {
      this.rolName = this.user.rolName;
    }
  }

  return() {
    this._location.back();
  }

  logOut() {
    this.auth.signOut();
  }

  profileSetting() {
    this.router.navigate(['/home/profile']);
  }

  colorStageBackground() {
    return `{background-color}`;
  }

  gradient() {
    const style = `linear-gradient(90deg, ${this.withOpacity(
      this.colorPhase,
      0.2
    )} 0%, #ffffff 100%)`;
    return style;
  }

  withOpacity(color: string, opacity: number) {
    const colorRgb = hexToRgb(color);
    const style = `rgba(${colorRgb.r},${colorRgb.g},${colorRgb.b}, ${opacity})`;
    return style;
  }
}
