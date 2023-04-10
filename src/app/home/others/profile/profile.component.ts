import { Component, OnInit } from '@angular/core';
import { OthersService } from '../others.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(private store: Store<AppState>, private service: OthersService) {}

  ngOnInit() {}
}
