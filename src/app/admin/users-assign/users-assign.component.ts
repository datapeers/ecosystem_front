import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { PhasesService } from '@home/phases/phases.service';
import { StartupsService } from '@shared/services/startups/startups.service';
import { UserAssign } from './model/user-to-assign';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ToastService } from '@shared/services/toast.service';
import { Table } from 'primeng/table';

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
    { field: 'phases', name: 'Fases asignadas', tooltip: '' },
    { field: 'batches', name: 'Batch asignados', tooltip: '' },
    { field: 'startups', name: 'StartUps asignados', tooltip: '' },
  ];
  filterFields = this.columns.map((column) => column.field);
  users: User[] = [];
  loading = true;

  phases = [];
  loadedPhases = false;

  batches = [];
  loadedBatches = false;

  startups = [];
  loadedStartups = false;

  rowInteract: UserAssign;

  showAddStartups = false;
  selectedStartups = [];

  showAddPhases = false;
  selectedPhases = [];

  showAddBatches = false;
  selectedBatches = [];

  rowMenuItemsHost: MenuItem[] = [];
  rowMenuItemsTeamCoach: MenuItem[] = [];
  validRoles = ValidRoles;
  @ViewChild('dt', { static: true }) dt: Table;
  scrollHeight;
  constructor(
    private toast: ToastService,
    private service: AdminService,
    private readonly phaseService: PhasesService,
    private readonly startupsService: StartupsService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    this.scrollHeight = `${innerHeight - 446}px`;
    this.rowMenuItemsHost = [
      {
        label: 'Asignar Fase',
        icon: 'pi pi-fw pi-plus',
        command: (event: { originalEvent: Event; item: any }) => {
          this.openPhasesDialog();
        },
      },
      {
        label: 'Asignar Batch',
        icon: 'pi pi-fw pi-plus',
        command: (event: { originalEvent: Event; item: any }) => {
          this.openBatchesDialog();
        },
      },
    ];
    this.rowMenuItemsTeamCoach = [
      {
        label: 'Asignar Batch',
        icon: 'pi pi-fw pi-plus',
        command: (event: { originalEvent: Event; item: any }) => {
          this.openBatchesDialog();
        },
      },
      {
        label: 'Asignar startups',
        icon: 'pi pi-fw pi-plus',
        command: (event: { originalEvent: Event; item: any }) => {
          this.openStartupsDialog();
        },
      },
    ];
  }

  ngOnInit() {
    this.initComponent();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
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
    // await this.getPhases();
    // await this.getStartups();
    await this.getPhasesAndBatches();
    await this.getUsers();
  }

  async getUsers() {
    const users = await this.service.getUsers(null, [
      ValidRoles.host,
      ValidRoles.teamCoach,
    ]);
    this.users = users.map((user) => {
      return new UserAssign(
        user,
        this.phases.map((i) => i._id),
        this.batches.map((i) => i._id)
      );
    });
    this.loading = false;
  }

  async getStartups() {
    if (this.loadedStartups) return;
    this.startups = (await this.startupsService.getDocuments({})).map((doc) => {
      return {
        _id: doc._id,
        name: doc.item.nombre,
      };
    });
    this.loadedStartups = true;
    return;
  }

  async getPhasesAndBatches() {
    if (this.loadedPhases || this.loadedBatches) return;
    const allList = await this.phaseService.getPhases();
    this.phases = allList
      .filter((i) => i.basePhase && !i.deleted)
      .sort((a, b) => {
        if (a.startAt > b.startAt) return -1; // Si 'a' es más reciente que 'b', 'a' debe ir antes
        if (a.startAt < b.startAt) return 1; // Si 'a' es más antiguo que 'b', 'b' debe ir antes
        return 0; // Si son iguales, no se cambia el orden
      })
      .map((doc) => {
        return { ...doc, _id: doc._id, name: doc.name };
      });

    const batches = allList
      .filter((i) => !i.basePhase && !i.deleted)
      .sort((a, b) => {
        if (a.startAt > b.startAt) return -1; // Si 'a' es más reciente que 'b', 'a' debe ir antes
        if (a.startAt < b.startAt) return 1; // Si 'a' es más antiguo que 'b', 'b' debe ir antes
        return 0; // Si son iguales, no se cambia el orden
      });
    for (const doc of batches) {
      const parent = this.phases.find((i) => i._id === doc.childrenOf);
      if (!parent) continue;
      this.batches.push({
        _id: doc._id,
        name: doc.name,
      });
    }
    this.loadedPhases = true;
    this.loadedBatches = true;
    return;
  }

  async openStartupsDialog() {
    this.toast.info({ detail: '', summary: 'Cargando startups...' });
    await this.getStartups();
    this.toast.clear();
    this.setSelected(this.rowInteract);
    this.showAddStartups = true;
  }

  async openPhasesDialog() {
    this.setSelected(this.rowInteract);
    this.showAddPhases = true;
  }

  async openBatchesDialog() {
    this.setSelected(this.rowInteract);
    this.showAddBatches = true;
  }

  setSelected(user: UserAssign) {
    this.selectedStartups = user.getStartups;
    this.selectedBatches = user.getBatches;
    this.selectedPhases = user.getPhases;
  }

  resetDialog() {
    this.selectedStartups = [];
    this.selectedBatches = [];
    this.selectedPhases = [];
    this.showAddStartups = false;
    this.showAddPhases = false;
    this.showAddBatches = false;
    this.rowInteract = undefined;
  }

  save() {
    this.confirmationService.confirm({
      key: 'adminConfirmDialog',
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que quiere guardar los cambios hechos?',
      message:
        'Al guardar cambios, esto repercutirá inmediatamente en el usuario en cuestión, ¿Desea continuar?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ summary: 'Guardando...', detail: '' });
        this.service
          .updateUser(this.rowInteract._id, {
            relationsAssign: {
              ...this.rowInteract.relationsAssign,
              phases: this.selectedPhases,
              batches: this.selectedBatches,
              startups: this.selectedStartups,
            },
          })
          .then((ans) => {
            const indexUser = this.users.findIndex((i) => i._id === ans._id);
            this.users[indexUser] = new UserAssign(
              ans,
              this.phases.map((i) => i._id),
              this.batches.map((i) => i._id)
            );
            this.users = [...this.users];
            this.toast.clear();
            this.resetDialog();
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al guardar cambios',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Página ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }
}
