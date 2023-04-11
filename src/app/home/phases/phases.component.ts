import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import {
  faBuilding,
  faUser,
  faUserTie,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

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
  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.loading = false;
  }

  onAction(event: { mouseEvent: MouseEvent; action: any }) {
    switch (event.action.action) {
      case 'manage':
        // this.service.goToManageSpace(this.selectedSpace, this.rolUser);
        break;
      case 'edit':
        // this.service.goToSpace(
        //   this.spaces.find(
        //     (i) =>
        //       i._id ===
        //       (this.tiposEspacios[0].type == 'announcement'
        //         ? '62057221931f0942b20a720d'
        //         : '62feac49d980808ed59325fb')
        //   )
        // );
        break;
    }
  }
}
