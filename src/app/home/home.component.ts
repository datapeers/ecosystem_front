import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { User } from '@auth/models/user';
import { Observable, Subject, takeUntil } from 'rxjs';

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
  @ViewChild('mainPanel') scrollbarPanel;
  constructor(private store: Store<AppState>) {
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
    this.user$ = this.store.select((storeState) => storeState.auth.user);
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {
    this.loading = false;
  }
}
