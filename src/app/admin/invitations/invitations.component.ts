import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subject, throttleTime } from 'rxjs';
import { Invitation } from '@shared/models/invitation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidRoles, validRoles } from '@auth/models/valid-roles.enum';
import { ToastService } from '@shared/services/toast.service';

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
  filterFields = this.columns.map((column) => column.field);
  invitations: Invitation[];
  loading: boolean = true;
  displayInvitationDialog: boolean;
  roles = validRoles;
  formInvitation: FormGroup;
  submit$: Subject<void> = new Subject();
  constructor(
    private readonly toast: ToastService,
    private readonly service: AdminService,
    readonly fb: FormBuilder
  ) {
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

  ngOnInit(): void {
    this.loadComponent();
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
    this.toast.info({ summary: 'Cancelando', detail: '' });
    await this.service.cancelInvitation(invitationRow._id);
    await this.loadInvitations();
    this.toast.clear();
  }
}
