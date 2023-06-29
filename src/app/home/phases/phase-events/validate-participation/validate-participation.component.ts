import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-validate-participation',
  templateUrl: './validate-participation.component.html',
  styleUrls: ['./validate-participation.component.scss'],
})
export class ValidateParticipationComponent implements OnInit, OnDestroy {
  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  loadComponent() {}
}
