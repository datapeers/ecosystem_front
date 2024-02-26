import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { AdminService } from '../admin.service';
import { RolesService } from './roles.service';
import { Subscription } from 'rxjs';
import { Rol } from '@auth/models/rol';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PermissionsComponent } from '../permissions/permissions.component';
import { Table } from 'primeng/table';
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
    //     expert: true,
  };
  columns = [{ field: 'name', name: 'Nombre', tooltip: 'Nombre' }];
  filterFields = this.columns.map((column) => column.field);
  @ViewChild('dt', { static: true }) dt: Table;
  scrollHeight;
  constructor(
    private readonly toast: ToastService,
    private readonly service: RolesService,
    private readonly adminService: AdminService,
    public dialogService: DialogService
  ) {
    this.scrollHeight = `${innerHeight - 446}px`;
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.roles$?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let resizeTimeout;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      this.scrollHeight = `${innerHeight - 446}px`;
    }, 250);
  }

  async loadComponent() {
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
      header: rol ? `Permisos de ${rol.name}` : 'Permisos',
      data: { rol },
    });
    const subscription$ = ref.onClose.subscribe((data) => {
      if (data) {
        this.toast.info({ detail: '', summary: 'Guardando...' });
        this.service
          .updateRol(rol._id, { permissions: data })
          .then((ans) => {
            this.toast.clear();
            this.toast.success({ detail: 'Cambios guardados', summary: '' });
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

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Página ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }

  onClick(rol: Rol) {
    if (rol.permissions.length <= 0) return;
    if (this.allowedChangePermissions[rol.type]) {
      this.editPermissions(rol);
      return;
    }
    const ref = this.dialogService.open(PermissionsComponent, {
      header: rol ? `Permisos de ${rol.name}` : 'Permisos',
      data: { rol, readOnly: true },
    });
  }
}
