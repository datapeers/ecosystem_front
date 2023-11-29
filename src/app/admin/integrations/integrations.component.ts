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
  appUrl = '';
  integrations$: Subscription;
  zoomIntegrationDone = false;
  constructor(
    private readonly router: Router,
    private service: IntegrationsService,
    private toast: ToastService
  ) {
    this.appUrl = window.location.href + '/redirect_zoom';
  }

  ngOnInit(): void {
    this.service
      .watchIntegrations()
      .then((integrations$) => {
        this.integrations$ = integrations$.subscribe((integrations) => {
          if (integrations.find((i) => i.type === TypeIntegration.zoom))
            this.zoomIntegrationDone = true;
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
    window.open(
      `https://zoom.us/oauth/authorize?response_type=code&client_id=${this.clientIdZoom}&redirect_uri=${this.appUrl}`
    );
  }
}
