import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { ConfigurationService } from '@home/configuration/configuration.service';
import { ConfigurationApp } from '@home/configuration/model/configurationApp';
import { Store } from '@ngrx/store';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss'],
})
export class InitComponent implements OnInit, OnDestroy {
  user: User;
  config: ConfigurationApp;
  constructor(
    private store: Store<AppState>,
    private serviceConfig: ConfigurationService
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

  async loadComponent() {
    console.log(this.user);
    this.config = await this.serviceConfig.getConfig();
    console.log(this.config);
  }
}
