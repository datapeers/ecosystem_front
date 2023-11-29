import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntegrationsService } from './integrations.service';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { TypeIntegration } from './model/type-integrations.enum';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
})
export class IntegrationsComponent implements OnInit, OnDestroy {
  clientIdZoom = '';
  clientSecretZoom = '';
  appUrl = '';
  integrations$: Subscription;
  zoomIntegrationDone = false;
  constructor(
    private readonly router: Router,
    private service: IntegrationsService,
    private toast: ToastService
  ) {
    this.appUrl = window.location.href + '/redirect_zoom';
    localStorage.removeItem('clientIdZoom');
    localStorage.removeItem('clientSecretZoom');
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
            this.clientIdZoom = zoomInt.metadata['clientIdZoom'];
            this.clientSecretZoom = zoomInt.metadata['clientSecretZoom'];
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

  saveChanges() {
    localStorage.setItem('clientIdZoom', this.clientIdZoom);
    localStorage.setItem('clientSecretZoom', this.clientSecretZoom);
    window.open(
      `https://zoom.us/oauth/authorize?response_type=code&client_id=${this.clientIdZoom}&redirect_uri=${this.appUrl}`,
      '_self'
    );
  }
}
