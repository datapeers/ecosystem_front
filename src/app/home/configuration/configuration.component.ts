import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { firstValueFrom, first } from 'rxjs';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  user: User;
  constructor(
    private store: Store<AppState>,
    private service: ConfigurationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  loadComponent() {}
}
