import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { faBuilding, faUser, faUserTie, faUsers, } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { PhasesService } from './phases.service';

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
})
export class PhasesComponent implements OnInit {
  loading = true;
  list = [
    {
      label: 'Fase 1',
      docs: [],
    },
  ];
  selected;
  actions = [
    {
      action: 'edit',
      label: 'Ver mas',
      icon: 'pi pi-pencil',
      class: '',
    },
  ];
  faBuilding = faBuilding;
  faUser = faUser;
  faUsers = faUsers;
  faUserTie = faUserTie;

  constructor(
    private store: Store<AppState>,
    private readonly phasesService: PhasesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = false;
  }

  onAction(event: { mouseEvent: MouseEvent; action: any }) {
    switch (event.action.action) {
      case 'manage':
        break;
      case 'edit':
        break;
    }
  }
}
