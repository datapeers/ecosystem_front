import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subject, throttleTime } from 'rxjs';
import { ValidRoles, validRoles } from '@shared/models/auth/valid-roles.enum';
import { Invitation } from '@shared/models/invitation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  invitations: Invitation[];
  loading: boolean = true;
  displayInvitationDialog: boolean;
  roles = validRoles;
  formInvitation: FormGroup;
  submit$: Subject<void> = new Subject();
  constructor(
    private readonly service: AdminService,
    readonly fb: FormBuilder
  ) {
    this.formInvitation = fb.group({
      email: fb.control<string>("", { validators: [ Validators.required, Validators.email ] }),
      rol: fb.control<ValidRoles>(ValidRoles.user, { validators: [ Validators.required ] })
    });
    this.submit$.pipe(throttleTime(250))
      .subscribe(() => {
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
    const invitation = await this.service.createInvitation(email, rol);
    if(invitation) {
      await this.loadInvitations();
    }
  }

  async cancelInvitation(invitationRow: Invitation) {
    await this.service.cancelInvitation(invitationRow._id);
    await this.loadInvitations();
  }
}
