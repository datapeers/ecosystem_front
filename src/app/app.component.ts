import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { lang_es } from '@shared/i18n/es';
import { PrimeNGConfig } from 'primeng/api';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { ToggleMenuAction } from '@home/store/home.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ecosystem';

  private readonly store = inject(Store<AppState>);

  constructor(
    public primengConfig: PrimeNGConfig,
    public auth: AuthService // ! don't remove, initialize listener and auth methods in all app
  ) {
    this.primengConfig.setTranslation(lang_es.primeng);
  }

  ngOnInit() {
    if (window.innerWidth > 768 && window.innerWidth <= 1500) {
      this.store.dispatch(new ToggleMenuAction());
    }
  }
}
