import { Component, OnInit } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ecosystem';

  constructor(
    public auth: AuthService // ! don't remove, initialize listener and auth methods in all app
  ) {}

  ngOnInit() {}
}
