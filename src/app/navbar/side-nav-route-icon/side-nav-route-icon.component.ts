import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { IMenuOption } from '@shared/models/menu';
import { filter } from 'rxjs';

@Component({
  selector: 'app-side-nav-route-icon',
  templateUrl: './side-nav-route-icon.component.html',
  styleUrls: ['./side-nav-route-icon.component.scss']
})
export class SideNavRouteIconComponent {
  activeMenuOption?: IMenuOption;

  constructor(
    private router: Router, 
    private readonly store: Store<AppState>
  ) {
    this.store.select(state => state.home.menu)
      .pipe(
        filter(menu => menu !== null)
      )
      .subscribe(menu => {
        this.activeMenuOption = menu.options.find(option => this.router.isActive(option.rute, true) );
        console.log(this.activeMenuOption);
      });
  }
}
