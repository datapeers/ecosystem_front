import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subject, throttleTime } from 'rxjs';
import { Invitation } from '@shared/models/invitation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidRoles, validRoles } from '@auth/models/valid-roles.enum';
import { ToastService } from '@shared/services/toast.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss'],
})
export class InvitationsComponent implements OnInit {
  columns = [
    { field: 'email', name: 'Correo' },
    { field: 'createdBy.fullName', name: 'Invitado por' },
    { field: 'rolName', name: 'Rol esperado' },
    { field: 'stateName', name: 'Estado' },
    { field: 'createdAt', name: 'Creada' },
    { field: 'expiresAt', name: 'Expira' },
  ];
  namesStates: {
    accepted: 'Acepto';
    disabled: 'Inhabilitado';
  };
  filterFields = this.columns.map((column) => column.field);
  invitations: Invitation[];
  loading: boolean = true;
  displayInvitationDialog: boolean;
  roles = validRoles;
  formInvitation: FormGroup;
  submit$: Subject<void> = new Subject();
  @ViewChild('dt', { static: true }) dt: Table;
  scrollHeight;
  constructor(
    private readonly toast: ToastService,
    private readonly service: AdminService,
    readonly fb: FormBuilder
  ) {
    this.scrollHeight = `${innerHeight - 446}px`;
    this.formInvitation = fb.group({
      email: fb.control<string>('', {
        validators: [Validators.required, Validators.email],
      }),
      rol: fb.control<ValidRoles>(ValidRoles.user, {
        validators: [Validators.required],
      }),
    });
    this.submit$.pipe(throttleTime(250)).subscribe(() => {
      const { email, rol } = this.formInvitation.value;
      this.createInvitation(email, rol);
    });
  }

  get primEmail() {
    return this.formInvitation.get('email');
  }

  ngOnInit(): void {
    this.loadComponent();
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
    await this.loadInvitations();
    this.loading = false;
  }

  async loadInvitations() {
    this.invitations = await this.service.getInvitations();
  }

  openInvitationDialog() {
    this.formInvitation.reset();
    this.displayInvitationDialog = true;
  }

  hideInvitationDialog() {
    this.displayInvitationDialog = false;
  }

  async createInvitation(email: string, rol: ValidRoles) {
    this.hideInvitationDialog();
    this.toast.info({ summary: 'Enviando...', detail: '', life: 20000 });
    const invitation = await this.service.createInvitation(email, rol);
    if (invitation) {
      this.toast.clear();
      this.toast.success({
        summary: 'Invitación enviada',
        detail: 'La invitación ha sido enviada al correo electrónico.',
      });
      await this.loadInvitations();
    } else {
      this.toast.clear();
      this.toast.error({
        summary: 'Invitación invalida',
        detail: 'Ha ocurrido un error en el envió de la invitación.',
      });
    }
  }

  async cancelInvitation(invitationRow: Invitation) {
    this.toast.info({ summary: 'Cancelando', detail: '', life: 20000 });
    await this.service.cancelInvitation(invitationRow._id);
    await this.loadInvitations();
    this.toast.clear();
  }

  async resendInvitation(invitationRow: Invitation) {
    this.toast.info({ summary: 'Reenviando...', detail: '', life: 20000 });
    await this.service.resendInvitation(invitationRow._id);
    this.toast.clear();
    this.toast.success({ summary: 'Invitación reenviada', detail: '' });
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Página ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }
}
