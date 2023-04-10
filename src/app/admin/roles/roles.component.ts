import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: string[] = [];
  loading: boolean = true;
  constructor(
    private readonly service: AdminService
  ) {
  }
  
  ngOnInit() {
    this.loadComponent();
  }

  async loadComponent() {
    this.roles = await this.service.getRoles();
    this.loading = false;
  }
}
