import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-users-assign',
  templateUrl: './users-assign.component.html',
  styleUrls: ['./users-assign.component.scss'],
})
export class UsersAssignComponent implements OnInit, OnDestroy {
  columns = [
    { field: 'fullName', name: 'Nombre', tooltip: '' },
    { field: 'email', name: 'Correo', tooltip: '' },
    { field: 'rolName', name: 'Rol', tooltip: '' },
    { field: 'Fases asignadas', name: 'Fases asignadas', tooltip: '' },
    { field: 'Batch asignados', name: 'Batch asignados', tooltip: '' },
    { field: 'Start ups asignados', name: 'Start ups asignados', tooltip: '' },
  ];
  filterFields = this.columns.map((column) => column.field);
  users: User[] = [];
  loading = true;

  constructor(
    private service: AdminService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  async initComponent() {
    this.getUsers();
  }

  async getUsers() {
    const users = await this.service.getUsers();
    this.users = users.map((user) => {
      return new User(user);
    });
    this.loading = false;
  }
}
