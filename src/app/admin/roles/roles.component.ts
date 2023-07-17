import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { RolesService } from './roles.service';
import { Subscription } from 'rxjs';
import { Rol } from '@auth/models/rol';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PermissionsComponent } from '../permissions/permissions.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit, OnDestroy {
  roles: Rol[] = [];
  loading: boolean = true;
  roles$: Subscription;
  allowedChangePermissions = {
    host: true,
    teamCoach: true,
    expert: true,
  };
  constructor(
    private readonly toast: ToastService,
    private readonly service: RolesService,
    private readonly adminService: AdminService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.roles$?.unsubscribe();
  }

  async loadComponent() {
    const rolesDB = await this.service.watchRoles;
    this.service
      .watchRoles()
      .then((roles$) => {
        this.roles$ = roles$.subscribe((rolesList: Rol[]) => {
          this.roles = rolesList;
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar roles',
          detail: err,
          life: 12000,
        });
        this.roles = [];
      });
    this.loading = false;
  }

  editPermissions(rol: Rol) {
    const ref = this.dialogService.open(PermissionsComponent, {
      header: 'Permisos',
      data: { rol },
    });
    const subscription$ = ref.onClose.subscribe((data) => {
      if (data) {
        this.toast.info({ detail: '', summary: 'Guardando...' });
        this.service
          .updateRol(rol._id, { permissions: data })
          .then((ans) => {
            this.toast.clear();
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al editar rol',
              detail: err,
              life: 12000,
            });
          });
      }
      subscription$?.unsubscribe();
    });
  }
}
