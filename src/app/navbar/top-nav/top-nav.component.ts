import { Component, Input, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';

import {
  SetLastContentRequest,
  ToggleMenuAction,
} from '@home/store/home.actions';
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
import { MenuItem, PrimeNGConfig, ResponsiveOverlayOptions } from 'primeng/api';
import { PhasesService } from '@home/phases/phases.service';
import { Phase } from '@home/phases/model/phase.model';
import { Stage } from '@home/phases/model/stage.model';
import { getPhaseAndNumb } from '@shared/utils/phases.utils';
import { PhaseContentService } from '@home/phases/phase-content/phase-content.service';
import { lastContent } from '@shared/models/lastContent';
import { StartupsService } from '@shared/services/startups/startups.service';
import {
  RolStartup,
  rolStartupNames,
} from '@home/startup-profile/models/rol-startup.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { channelsNotificationEnum } from '../notifications/models/chanels-notification.enum';
import { NotificationTypes } from '../notifications/models/notification-types.enum';
import { NotificationStates } from '../notifications/models/notification-states.enum';
import { searchResult } from '@shared/models/common/search-result.model';
import { FormService } from '@shared/form/form.service';
import { Permission } from '@auth/models/permissions.enum';
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  animations: [fadeInOut],
})
export class TopNavComponent {
  items: ProtectedMenuItem[];
  user: User;
  profileDoc;
  startup: Startup;

  menu$: Observable<IMenu>;
  returnBtn$: Observable<boolean>;

  searchValue: string;
  search$: Subject<String> = new Subject<String>();
  searchEnabled: boolean = false;

  onDestroy$: Subject<void> = new Subject();

  @Input() menuExpanded: boolean = true;
  @Input() screenWith = 0;

  percentCompleted = 75;
  percentCompletedString = '75%';
  rolName = '';
  viewUserBoard = false;
  viewNotificationBoard = false;
  viewSearchItem = false;
  colorPhase = '#EA4254';
  overlayLoading = true;
  mainMenu;
  overlayVisible = false;

  phasesBases = 0;
  phasesUser = 0;
  phaseName = '';
  phaseNumb = '';
  currentBatch: Phase | any;
  stage: Stage;

  set searchResults(results: MenuItem[]) {
    if (results) {
      this.overlayLoading = false;
    }
    this._searchResults = results;
  }
  _searchResults: MenuItem[] = [];
  lastContent: lastContent;
  loadingLastContent = false;

  public get rolStartups(): typeof RolStartup {
    return RolStartup;
  }

  public get rolStartupsNames(): typeof rolStartupNames {
    return rolStartupNames;
  }

  public get userPermission(): typeof Permission {
    return Permission;
  }

  allowAdmin = false;
  rolesAdmin = [ValidRoles.superAdmin, ValidRoles.admin];
  pendingNotification = false;
  idsPhasesUser = [];
  constructor(
    private router: Router,
    private readonly store: Store<AppState>,
    private readonly auth: AuthService,
    private _location: Location,
    private primengConfig: PrimeNGConfig,
    private phasesService: PhasesService,
    private contentService: PhaseContentService,
    private startupService: StartupsService,
    private notificationService: NotificationsService,
    private readonly formService: FormService
  ) {
    const responsiveOptions: ResponsiveOverlayOptions = {
      style: 'width: 500px',
      breakpoint: '640px',
      media: '640px',
    };
    this.primengConfig.overlayOptions = {
      appendTo: 'body',
      responsive: responsiveOptions,
    };
    this.menu$ = this.store.select((storeState) => storeState.home.menu);
    this.returnBtn$ = this.store.select(
      (storeState) => storeState.home.returnBtn
    );
    this.search$
      .pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe((value: string) => {
        const stringSearch = value?.trim();
        if (!stringSearch || stringSearch === '') {
          this.clearSearch();
          return;
        }
        this.overlayLoading = true;
        this.overlayVisible = true;
        this.searchMethod(stringSearch);
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
        this.mainMenu = await firstValueFrom(
          this.store.select((s) => s.home.menu).pipe(first((i) => i !== null))
        );
        this.allowAdmin = this.rolesAdmin.includes(this.user.rolType);
        if (this.user.isUser) {
          this.setUserOptions();
        }
        this.notificationSub();
      });
  }

  lastContentSub() {
    this.store
      .select((store) => store.home.lastContent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (i) => {
        if (!this.lastContent && !this.loadingLastContent) {
          this.loadingLastContent = true;
          const req = await this.contentService.getLastContent(
            this.currentBatch._id,
            this.startup._id
          );
          this.store.dispatch(new SetLastContentRequest(req));
          return;
        }
        this.lastContent = i;
        if (this.lastContent) {
          this.percentCompleted = Math.round(
            (i.contentCompleted / i.numberOfContent) * 100
          );
          this.percentCompletedString = `${this.percentCompleted}%`;
        }
      });
  }

  notificationSub() {
    this.notificationService
      .watchNotifications([
        `${channelsNotificationEnum.userNotification} ${this.user._id};`,
      ])
      .then((notifications$) => {
        notifications$
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((notificationList) => {
            this.pendingNotification = notificationList.find(
              (i) => i.state === NotificationStates.pending
            )
              ? true
              : false;
          });
      });
  }

  async setUserOptions() {
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    this.startup = this.profileDoc.startups[0];
    const userPhases = await this.phasesService.getPhasesList(
      this.profileDoc['startups'][0].phases.map((i) => i._id),
      true
    );
    const basesPhase = userPhases.filter((i) => i.basePhase);
    this.phasesBases = basesPhase.length;
    this.idsPhasesUser = userPhases
      .filter((i) => !i.basePhase)
      .map((i) => i._id);
    this.phasesUser = this.idsPhasesUser.length;

    this.currentBatch = await firstValueFrom(
      this.store
        .select((store) => store.home.currentBatch)
        .pipe(first((i) => i !== null))
    );
    this.colorPhase = this.currentBatch.stageDoc.color;
    [this.phaseName, this.phaseNumb] = getPhaseAndNumb(this.currentBatch.name);

    this.stage = this.currentBatch.stageDoc;
    this.lastContentSub();
  }

  goTo(option: IMenuOption) {
    option.command();
    this.clearSearch();
    this.closeAll();
  }

  clearSearch() {
    this.overlayLoading = false;
    this.overlayVisible = false;
    this.searchValue = null;
    this.searchEnabled = false;
  }

  toggleSearch() {
    this.searchEnabled = !this.searchEnabled;
  }

  toggleMenu() {
    this.store.dispatch(new ToggleMenuAction());
  }

  getHeadClass() {
    let styleClass = '';
    if (this.menuExpanded && this.screenWith > 992) {
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
      const startup = this.profileDoc.startups[0];
      this.startup = await this.startupService.getDocument(startup._id);
      const currentBatch = await firstValueFrom(
        this.store
          .select((store) => store.home.currentBatch)
          .pipe(first((i) => i !== null))
      );
      const profileInStartup = this.startup.entrepreneurs.find(
        (i) => this.profileDoc._id === i._id
      );
      this.rolName = this.rolStartupsNames[profileInStartup.rol];
    } else {
      this.rolName = this.user.rolName;
    }
  }

  return() {
    this._location.back();
    this.closeAll();
  }

  logOut() {
    this.auth.signOut();
    this.closeAll();
  }

  profileSetting() {
    this.router.navigate(['/home/profile']);
    this.closeAll();
  }

  profileStartup() {
    this.router.navigate(['/home/startup']);
    this.closeAll();
  }

  adminPanel() {
    this.router.navigate(['/home/admin']);
    this.closeAll();
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

  async searchMethod(searchValue: string) {
    // const { spaceList, resourceList, contentList } =
    //   await this.service.getSearchResult(this.idsSpacesUser, searchValue);
    const search = await this.phasesService.searchInBatch(
      this.idsPhasesUser,
      searchValue
    );
    const sectionItems = [];
    const optionsMenu = this.mainMenu.options;
    for (const menuItem of optionsMenu) {
      switch (menuItem.type) {
        case 'single':
          if (menuItem.label.match(new RegExp(searchValue, 'i')) !== null)
            sectionItems.push({
              label: menuItem.label,
              tag: 'Sección',
              command: () => {
                this.router.navigate([menuItem.rute], {
                  queryParams: menuItem.queryParamsRute,
                });
              },
            });
          break;
        case 'dropdown':
          for (const subItem of menuItem.children) {
            if (subItem.label.match(new RegExp(searchValue, 'i')) !== null)
              sectionItems.push({
                label: subItem.label,
                tag: 'Sección',
                command: () => {
                  this.router.navigate([subItem.rute], {
                    queryParams: subItem.queryParamsRute,
                  });
                },
              });
          }
          break;
        default:
          break;
      }
    }
    const spaceItems = this.user.isUser
      ? search.ansPhases.map((result: searchResult) => ({
          label: result.label,
          tag: result.metadata['tag'],
          command: () => {
            this.goBatchByResult(result.metadata['_id']);
          },
        }))
      : [];
    const resourceItems = this.user.isUser
      ? search.ansResource.map((result: searchResult) => ({
          label: result.label,
          tag: 'Recurso',
          command: () => {
            this.goTooltipByResult(result.metadata['batch']);
          },
        }))
      : [];
    const contentItems = this.user.isUser
      ? search.ansContent.map((result: searchResult) => ({
          label: result.label,
          tag: 'Contenido',
          command: () => {
            this.goBatchByResult(result.metadata['batch']);
          },
        }))
      : [];
    this.searchResults = [
      ...sectionItems,
      ...spaceItems,
      ...resourceItems,
      ...contentItems,
    ];
  }

  closeAll() {
    this.viewUserBoard = false;
    this.viewNotificationBoard = false;
    this.viewSearchItem = false;
    this.overlayVisible = false;
  }

  goContent() {
    this.router.navigate(['/home/contents']);
    this.closeAll();
  }

  goBatchByResult(batch: string) {
    this.router.navigate(['/home/contents'], { queryParams: { batch } });
    this.closeAll();
  }

  goTooltipByResult(batch: string) {
    this.router.navigate(['/home/toolkit'], { queryParams: { batch } });
    this.closeAll();
  }

  async openFormApp() {
    this.formService.openFormApp();
  }
}
