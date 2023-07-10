import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { RolesService } from './roles.service';
import { Subscription } from 'rxjs';
import { Rol } from '@auth/models/rol';
import { ToastService } from '@shared/services/toast.service';
import { ValidRoles, rolNames } from '@auth/models/valid-roles.enum';
import { cloneDeep } from '@apollo/client/utilities';
import { ConfirmationService } from 'primeng/api';

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
  };
  constructor(
    private readonly toast: ToastService,
    private readonly service: RolesService,
    private readonly adminService: AdminService,
    private confirmationService: ConfirmationService
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
          console.log(this.roles);
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

  refresh(rol: Rol) {
    this.confirmationService.confirm({
      key: 'adminConfirmDialog',
      acceptLabel: 'Descartar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere descartar los cambios hechos?',
      message:
        'Al descartar cambios se restablecerán los permisos de la ultima version, ¿Desea continuar?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        rol.permissions = { ...cloneDeep(rol.backup_permissions) };
      },
    });
  }

  saveChanges(rol: Rol) {
    this.confirmationService.confirm({
      key: 'adminConfirmDialog',
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de continuar?',
      message:
        'Al guardar cambios, estos serán inmediatos para todos los usuarios con esté rol',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Guardando...' });
        this.service
          .updateRol(rol._id, { permissions: rol.permissions })
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
      },
    });
  }
}
