import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '@auth/models/user';
import { MenuItem } from 'primeng/api';
import { PermissionsComponent } from '../permissions/permissions.component';
import { ValidRoles, rolValues } from '@auth/models/valid-roles.enum';
import { ToastService } from '@shared/services/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { firstValueFrom, first } from 'rxjs';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-users-panel',
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.scss'],
})
export class UsersPanelComponent implements OnInit {
  columns = [
    { field: 'fullName', name: 'Nombre', tooltip: '' },
    { field: 'email', name: 'Correo', tooltip: '' },
    { field: 'rolName', name: 'Rol', tooltip: '' },
    { field: 'createdAt', name: 'Creado', tooltip: '' },
    { field: 'updatedAt', name: 'Modificado', tooltip: '' },
    {
      field: 'isActive',
      name: 'Activo',
      tooltip: 'El usuario puede acceder a la aplicación',
    },
    {
      field: 'passwordSet',
      name: 'Registrado',
      tooltip: 'El usuario completo el registro con su propia contraseña',
    },
    { field: 'uid', name: 'Uid', tooltip: '' },
  ];
  filterFields = this.columns.map((column) => column.field);
  user: User;
  users: User[] = [];
  loading = true;
  rowInteract: User;
  menuUser: MenuItem[];
  editPermission = [ValidRoles.teamCoach, ValidRoles.host, ValidRoles.expert];
  @ViewChild('dt', { static: true }) dt: Table;
  scrollHeight;

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private service: AdminService,
    public dialogService: DialogService
  ) {
    this.scrollHeight = `${innerHeight - 446}px`;
    this.menuUser = [
      {
        label: 'Editar permisos',
        icon: 'pi pi-fw pi-check-circle',
        command: (event: { originalEvent: Event; item: any }) => {
          this.editPermissions();
        },
      },
    ];
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit() {
    this.initComponent();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let resizeTimeout;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      this.scrollHeight = `${innerHeight - 446}px`;
    }, 250);
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

  editPermissions() {
    if (rolValues[this.rowInteract.rolType] >= rolValues[this.user.rolType]) {
      this.toast.alert({
        summary: 'Error: Restricción de privilegios',
        detail:
          'No tienes permisos suficientes para modificar a una persona con un rol similar o superior. Por favor, contacta a un administrador para realizar esta acción.',
      });
      return;
    }
    const ref = this.dialogService.open(PermissionsComponent, {
      header: 'Permisos',
      data: { rol: this.rowInteract.rol, user: this.rowInteract },
    });
    const subscription$ = ref.onClose.subscribe((data) => {
      if (data) {
        this.toast.info({ detail: '', summary: 'Guardando...' });
        this.service
          .updateUser(this.rowInteract._id, { permissions: data })
          .then((ans) => {
            const indexUser = this.users.findIndex((i) => i._id === ans._id);
            this.users[indexUser] = new User(ans);
            this.users = [...this.users];
            this.toast.clear();
            this.toast.clear();
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al editar permisos del usuario',
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
}
