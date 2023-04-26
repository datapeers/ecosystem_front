import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-phase-content',
  templateUrl: './phase-content.component.html',
  styleUrls: ['./phase-content.component.scss'],
})
export class PhaseContentComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
