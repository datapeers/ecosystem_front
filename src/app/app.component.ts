import { Component, OnInit } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ecosystem';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
