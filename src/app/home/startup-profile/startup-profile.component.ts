import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { StartupsService } from '@shared/services/startups/startups.service';
import { ToastService } from '@shared/services/toast.service';
import { first, firstValueFrom } from 'rxjs';
import { FormService } from '../../shared/form/form.service';
import { FormCollections } from '@shared/form/enums/form-collections';

@Component({
  selector: 'app-startup-profile',
  templateUrl: './startup-profile.component.html',
  styleUrls: ['./startup-profile.component.scss'],
})
export class StartupProfileComponent implements OnInit, OnDestroy {
  user: User;
  loaded = false;
  profileDoc;
  startup: Startup;
  responsable;
  formStartup;
  formNegociosFields = [];
  noValuePlaceholder: string = '- - - -';
  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private startupService: StartupsService,
    private formService: FormService
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
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  async loadComponent() {
    this.loaded = false;
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    const startup = this.profileDoc.startups[0];
    this.startup = await this.startupService.getDocument(startup._id);
    this.responsable = this.startup.entrepreneurs.find(
      (i) => i.rol === 'leader'
    );
    console.log(this.startup);
    console.log(this.responsable);
    const formsStartups = await this.formService.getFormByCollection(
      FormCollections.startups
    );
    if (!formsStartups.length) {
      return;
    }
    this.formStartup = formsStartups.find(() => true);
    const formNegociosComponents = this.formService.getFormComponents(
      this.formStartup
    );
    const ignore = ['nombre', 'descripcion'];
    this.formNegociosFields = this.formService
      .getInputComponents(formNegociosComponents)
      .filter((i) => !ignore.includes(i.key));
    console.log(this.formNegociosFields);
    this.loaded = true;
  }
}
