import { Component } from '@angular/core';
import { TermsOfUseService } from '@shared/services/termsOfUse/terms-of-use.service';
import { ToastService } from '../../services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TermsOfUse } from '@shared/services/termsOfUse/terms-of-use.model';
import { UserService } from '@auth/user.service';
import { User } from '@auth/models/user';

@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss'],
})
export class TermsDialogComponent {
  loaded = false;
  terms: TermsOfUse;
  expert;
  user: User;
  saving = false;
  hoursDonated = 0;
  constructor(
    private service: TermsOfUseService,
    private toast: ToastService,
    public config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    this.loaded = false;
    this.expert = this.config.data.expert;
    this.user = this.config.data.user;
    this.service
      .getTermsOfUse('experts')
      .then((ans) => {
        this.loaded = true;
        this.terms = ans;
      })
      .catch((err) => {
        this.loaded = true;
        console.warn(err);
        this.toast.error({
          summary: 'Error al cargar términos de uso',
          detail: err,
          life: 20000,
        });
      });
  }

  async saveChanges() {
    this.saving = true;
    this.toast.info({ summary: 'Guardando', detail: '', life: 120000 });
    this.userService
      .updateUser(this.user._id, {
        relationsAssign: {
          ...this.user.relationsAssign,
          termsAccepted: true,
          hoursDonated: this.hoursDonated,
        },
      })
      .then((ans) => {
        this.toast.clear();
        this.ref.close({
          termsAccepted: true,
          hoursDonated: this.hoursDonated,
        });
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.error({
          summary: 'Error al aceptar términos',
          detail: err,
          life: 120000,
        });
        this.saving = false;
      });
  }
}
