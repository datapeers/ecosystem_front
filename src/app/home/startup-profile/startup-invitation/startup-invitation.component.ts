import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
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
  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private startupService: StartupsService,
    private routeOpt: ActivatedRoute
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
      this.startup = await this.startupService.getDocument(this.startupId);
    } catch (error) {
      this.error = error;
    }
    this.loaded = true;
  }
}
