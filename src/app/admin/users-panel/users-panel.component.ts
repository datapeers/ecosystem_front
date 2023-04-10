import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '@shared/models/auth/user';

@Component({
  selector: 'app-users-panel',
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.scss']
})
export class UsersPanelComponent implements OnInit {
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
