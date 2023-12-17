import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { User } from '@auth/models/user';
import { Observable, Subject, takeUntil, firstValueFrom, first } from 'rxjs';
import { SearchCurrentBatch } from './store/home.actions';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
  onDestroy$: Subject<void> = new Subject();
  user: User;
  loading: boolean = true;
  menuExpanded: boolean;
  screenWidth = 0;
  @ViewChild('mainPanel') scrollbarPanel;

  @HostListener('window:fullscreenchange', ['$event'])
  screenChange(event) {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
  }

  constructor(private store: Store<AppState>, private toast: ToastService) {
    this.screenWidth = window.innerWidth;
    this.store
      .select((storeState) => storeState.home.menuExpanded)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((expanded) => {
        this.menuExpanded = expanded;
        //This is used as a quick fix to re-calculate the scrollbar position
        //After the menu hide animation has finished. 200ms is the transition duration in CSS
        //This case is not required on small screens because the menu position is fixed on that case
        if (this.scrollbarPanel && expanded === false) {
          const menuCloseDurationMs = 200;
          setTimeout(() => {
            this.scrollbarPanel.refresh();
          }, menuCloseDurationMs);
        }
      });
    // this.user$ = this.store.select((storeState) => storeState.auth.user);
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    -this.toast.clear();
    this.loading = false;
    if (this.user.isUser) {
      const profile = await firstValueFrom(
        this.store
          .select((state) => state.auth.profileDoc)
          .pipe(first((i) => i !== null))
      );
      console.log(profile);
      this.store.dispatch(new SearchCurrentBatch(profile));
    }
  }

  getBodyClass(): string {
    let styleClass = '';
    if (this.menuExpanded && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.menuExpanded &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
