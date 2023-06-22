import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { lang_es } from '@shared/i18n/es';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ecosystem';

  constructor(
    public primengConfig: PrimeNGConfig,
    public auth: AuthService // ! don't remove, initialize listener and auth methods in all app
  ) {
    this.primengConfig.setTranslation(lang_es.primeng);
  }

  ngOnInit() {}
}
