import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntegrationsService } from './integrations.service';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { TypeIntegration } from './model/type-integrations.enum';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
})
export class IntegrationsComponent implements OnInit, OnDestroy {
  appUrl = '';
  integrations$: Subscription;
  zoomIntegrationDone = false;
  user: User;
  clientIntegrationZoom: UntypedFormGroup;
  saving = false;
  constructor(
    private readonly router: Router,
    private service: IntegrationsService,
    private toast: ToastService,
    private store: Store<AppState>
  ) {
    this.appUrl = window.location.href + '/redirect_zoom';
    // localStorage.removeItem('clientIdZoom');
    // localStorage.removeItem('clientSecretZoom');
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
    this.clientIntegrationZoom = new UntypedFormGroup({
      email: new UntypedFormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      accountId: new UntypedFormControl(null, Validators.required),
      clientId: new UntypedFormControl(null, Validators.required),
      clientSecret: new UntypedFormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.service
      .watchIntegrations()
      .then((integrations$) => {
        this.integrations$ = integrations$.subscribe((integrations) => {
          const zoomInt = integrations.find(
            (i) => i.typeIntegration === TypeIntegration.zoom
          );
          if (zoomInt) {
            this.zoomIntegrationDone = true;
            this.clientIntegrationZoom
              .get('email')
              .setValue(zoomInt.metadata['email']);
            this.clientIntegrationZoom
              .get('accountId')
              .setValue(zoomInt.metadata['accountId']);
            this.clientIntegrationZoom
              .get('clientId')
              .setValue(zoomInt.metadata['clientId']);
            this.clientIntegrationZoom
              .get('clientSecret')
              .setValue(zoomInt.metadata['clientSecret']);
          }
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar integraciones',
          detail: err,
          life: 12000,
        });
      });
  }

  ngOnDestroy(): void {
    this.integrations$?.unsubscribe();
  }

  async saveChanges() {
    // localStorage.setItem('clientIdZoom', this.clientIdZoom);
    // localStorage.setItem('clientSecretZoom', this.clientSecretZoom);
    // window.open(
    //   `https://zoom.us/oauth/authorize?response_type=code&client_id=${this.clientIdZoom}&redirect_uri=${this.appUrl}`,
    //   '_self'
    // );
    this.saving = true;
    this.toast.info({
      summary: 'Guardando',
      detail: 'Por favor espere',
      life: 200000,
    });
    const zoomIntDoc = this.clientIntegrationZoom.value;
    try {
      const doc = await this.service.createIntegration({
        code: this.user._id,
        typeIntegration: TypeIntegration.zoom,
        metadata: {
          email: zoomIntDoc['email'],
          accountId: zoomIntDoc['accountId'],
          clientId: zoomIntDoc['clientId'],
          clientSecret: zoomIntDoc['clientSecret'],
        },
      });
      this.toast.clear();
    } catch (error) {
      this.toast.clear();
      this.toast.error({
        summary: 'Error al vincular app de zoom',
        detail: error,
      });
    }
    this.saving = false;
  }
}
