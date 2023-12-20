import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntegrationsService } from '../integrations.service';
import { ToastService } from '@shared/services/toast.service';
import { TypeIntegration } from '../model/type-integrations.enum';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements OnInit {
  appUrl = '';
  loaded = false;
  validCode = false;
  constructor(
    private readonly router: Router,
    private service: IntegrationsService,
    private toast: ToastService
  ) {
    this.appUrl = window.location.href + '/redirect_zoom';
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  async loadComponent() {
    const splicedUrl = this.router.url.split('code=');
    if (!splicedUrl[1]) {
      this.validCode = false;
    } else {
      try {
        const doc = await this.service.createIntegration({
          code: splicedUrl[1],
          typeIntegration: TypeIntegration.zoom,
          metadata: {
            clientIdZoom: sessionStorage.getItem('clientIdZoom'),
            clientSecretZoom: sessionStorage.getItem('clientSecretZoom'),
          },
        });
        this.validCode = true;
        setTimeout(() => {
          this.router.navigate(['/home/admin']);
        }, 3000);
      } catch (error) {
        this.validCode = false;
        this.toast.error({
          summary: 'Error al verificar codigo de zoom',
          detail: error,
          life: 12000,
        });
      }
    }
    sessionStorage.removeItem('clientIdZoom');
    sessionStorage.removeItem('clientSecretZoom');
    this.loaded = true;
  }
}
