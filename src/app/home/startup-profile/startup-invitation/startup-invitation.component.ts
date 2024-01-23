import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { PhasesService } from '@home/phases/phases.service';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { EntrepreneursService } from '@shared/services/entrepreneurs/entrepreneurs.service';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-startup-invitation',
  templateUrl: './startup-invitation.component.html',
  styleUrls: ['./startup-invitation.component.scss'],
})
export class StartupInvitationComponent {
  startupId;
  startup: Startup;
  loaded = false;
  error;
  user: User;
  profileDoc;
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private toast: ToastService,
    private startupService: StartupsService,
    private routeOpt: ActivatedRoute,
    private phasesService: PhasesService,
    private readonly service: EntrepreneursService,
    private confirmationService: ConfirmationService
  ) {
    this.startupId = this.routeOpt.snapshot.params['startupId'];
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  async loadComponent() {
    this.loaded = false;
    if (!this.startupId || this.startupId === '') {
      this.loaded = true;
      this.error = 'Url invalido';
      return;
    }
    try {
      const hasChanged = sessionStorage.getItem('changedStartup');
      if (hasChanged) {
        this.toast.info({
          summary: 'Ya cambiaste de startup, te re-direccionaremos al perfil',
          detail: '',
        });
        setTimeout(() => {
          this.router.navigate(['/home/startup']);
        }, 1500);
        return;
      }
      this.startup = await this.startupService.getDocument(this.startupId);
      this.profileDoc = await firstValueFrom(
        this.store
          .select((store) => store.auth.profileDoc)
          .pipe(first((i) => i !== null))
      );
      if (this.profileDoc.startups.find((i) => i._id === this.startup._id)) {
        this.error = 'Ya perteneces a esta startup';
        this.loaded = true;
        return;
      }

      const userPhases = await this.phasesService.getPhasesList(
        this.startup.phases.map((i) => i._id),
        true
      );
      const batchesStartups = userPhases.filter((i) => !i.basePhase);
      if (
        batchesStartups.find((i) => i.childrenOf !== '65242ea3baa24cae19bd5baf')
      ) {
        this.error =
          'Esta startup ya supero la fase onboarding, ya no puede cambiar los integrantes de la startup';
        this.loaded = true;
        return;
      }
    } catch (error) {
      console.warn(error);
      this.error = error;
    }
    this.loaded = true;
  }

  async accept() {
    this.confirmationService.confirm({
      key: 'confirmDialogStartup',
      acceptLabel: 'Cambiar startup',
      rejectLabel: 'Permanecer sin cambios',
      header: '¿Está seguro de que desea unirse a otra startUp?',
      message:
        'Al aceptar el cambio, estarás confirmando tu consentimiento para el cambio de startUp lo que significa que dejarás de tener acceso a la información de la startup anterior. Para aceptar este cambio y continuar usando la app, haz clic en "Aceptar". Si prefieres no aceptar, solo ignora esto',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({
          summary: 'Moviendo',
          detail: 'Por favor espere',
          life: 12000000,
        });
        try {
          await this.service.linkWithStartups(
            [this.profileDoc._id],
            [this.startup._id]
          );
          this.toast.clear();
          this.toast.info({ summary: 'Cambio realizado', detail: '' });
          sessionStorage.setItem('changedStartup', 'true');
          window.location.reload();
        } catch (error) {
          this.toast.clear();
          this.toast.error({
            summary: 'Error al intentar mezclar emprendedor y startup',
            detail: error,
          });
        }
      },
      reject: async () => {
        this.router.navigate(['/home/startup']);
      },
    });
  }
}
