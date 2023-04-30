import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-users-panel',
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.scss']
})
export class UsersPanelComponent implements OnInit {
  columns = [
    { field: "fullName", name: "Nombre", tooltip: "" },
    { field: "email", name: "Correo", tooltip: "" },
    { field: "rolName", name: "Rol", tooltip: "" },
    { field: "createdAt", name: "Creado", tooltip: "" },
    { field: "updatedAt", name: "Modificado", tooltip: "" },
    { field: "isActive", name: "Activo", tooltip: "El usuario puede acceder a la aplicación" },
    { field: "passwordSet", name: "Registrado", tooltip: "El usuario completo el registro con su propia contraseña" },
    { field: "uid", name: "Uid", tooltip: "" },
  ];
  filterFields = this.columns.map(column => column.field);
  users: User[] = [];
  loading = true;
  constructor(
    private service: AdminService,
    public dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  async initComponent() {
    this.getUsers();
  }

  async getUsers() {
    const users = await this.service.getUsers();
    this.users = users.map(user => { return new User(user); });
    this.loading = false;
  }
}
