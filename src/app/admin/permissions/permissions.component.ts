import { Component } from '@angular/core';
import { Permission, item_permission } from '@auth/models/permissions.enum';
import { permissionsUI } from '@auth/models/rol';
import { ToastService } from '@shared/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent {
  permissions: item_permission[];
  selectedPermissions: item_permission[];
  loading = true;
  constructor(
    private ref: DynamicDialogRef,
    private toast: ToastService,
    private confirmationService: ConfirmationService,
    private config: DynamicDialogConfig
  ) {
    if (!this.config.data?.rol) {
      this.toast.info({ summary: 'Rol invalido', detail: '' });
      this.ref.close();
    }
    this.setPermission();
  }

  setPermission() {
    this.loading = true;
    [this.permissions, this.selectedPermissions] = permissionsUI(
      this.config.data?.user?.permissions ?? this.config.data?.rol?.permissions
    );
    this.permissions = [...this.permissions];
    this.loading = false;
  }

  refresh() {
    this.confirmationService.confirm({
      key: 'adminConfirmDialog',
      acceptLabel: 'Descartar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere descartar los cambios hechos?',
      message:
        'Al descartar cambios se restablecerán los permisos antes de cualquier acción, ¿Desea continuar?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.setPermission();
      },
    });
  }

  saveChanges() {
    this.confirmationService.confirm({
      key: 'adminConfirmDialog',
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de continuar?',
      message:
        'Al guardar cambios, estos serán inmediatos para todos los usuarios con esté rol',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.ref.close(this.selectedPermissions.map((i) => i.key));
      },
    });
  }
}
