import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { firstValueFrom, first, Subscription } from 'rxjs';
import { User } from '@auth/models/user';
import { ConfigurationApp } from './model/configurationApp';
import { configTinyMce } from '@shared/models/configTinyMce';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '@shared/services/toast.service';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  user: User;
  config: ConfigurationApp;
  loaded = false;
  saving = false;
  watchConfig$: Subscription;

  public get configTiny(): typeof configTinyMce {
    return configTinyMce;
  }

  constructor(
    private store: Store<AppState>,
    private service: ConfigurationService,
    private toast: ToastService,
    private confirmationService: ConfirmationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.watchConfig$?.unsubscribe();
  }

  async loadComponent() {
    this.watchConfig$ = (await this.service.watchConfig()).subscribe(
      async (i) => {
        this.loaded = false;
        this.config = i;
        console.log(this.config);
        this.loaded = true;
      }
    );
  }

  saveChanges() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      header: '¿Está usted seguro de que desea guardar los cambios?',
      rejectButtonStyleClass: 'button-grey',
      message:
        'Le recordamos que al proceder con la acción de guardar, dichas modificaciones se actualizarán de manera inmediata y estarán disponibles para todos los usuarios. ¿Desea continuar con esta acción?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.saving = true;
        this.toast.info({ detail: '', summary: 'Guardando...' });
        this.service
          .updateConfig(this.config._id, this.config.save())
          .then((ans) => {
            this.saving = false;
            this.toast.clear();
            this.toast.success({
              detail: '',
              summary: 'Cambios guardados!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.saving = false;
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar guardar cambios',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }
}
