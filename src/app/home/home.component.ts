import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user$: Observable<any | null>;
  menuExpanded$: Subscription;
  user: any;
  loading: boolean = true;
  menuExpanded: boolean;
  @ViewChild('mainPanel') scrollbarPanel;
  constructor(private store: Store<AppState>) {
    this.menuExpanded$ = this.store
      .select((storeState) => storeState.home.menuExpanded)
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
    this.menuExpanded$?.unsubscribe();
  }

  async loadComponent() {
    // const userState = await firstValueFrom(this.user$);
    // this.user = await firstValueFrom(userState);
    this.loading = false;
  }
}
