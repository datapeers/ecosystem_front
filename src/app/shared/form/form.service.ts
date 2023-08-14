import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { map, take, tap } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
import { AppForm, IForm } from './models/form';
import formQueries from './form.gql';
import { FormCollections, formCollections } from './enums/form-collections';
import { IFormSubscription } from './models/form-subscription';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { CreateSubscriptionArgs as CreateSubscriptionInput } from './models/create-subscription.input';
import { ToastService } from '@shared/services/toast.service';
import { FormViewComponent } from './form-view/form-view.component';
import { AuthCodeService } from '@auth/auth-code.service';
import { Announcement } from '@home/announcements/model/announcement';

const formUrls = {
  renderer: `${environment.forms}form/renderer`,
  announcement: `${environment.forms}form/announcement`,
};

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly dialogService: DialogService,
    private readonly toast: ToastService,
    private readonly authCodeService: AuthCodeService
  ) {}

  getForm(id: string): Promise<AppForm> {
    const refQuery = this.graphql.refQuery(
      formQueries.query.form,
      { id },
      'no-cache',
      { auth: false }
    );
    return firstValueFrom(
      this.graphql.query(refQuery).pipe(
        map((request) => request.data.form),
        map((form) => AppForm.fromJson(form))
      )
    );
  }

  getFormByCollection(targetCollection: FormCollections): Promise<AppForm[]> {
    const refQuery = this.graphql.refQuery(
      formQueries.query.forms,
      { target: targetCollection },
      'cache-first',
      { auth: false }
    );
    return firstValueFrom(
      this.graphql.query(refQuery).pipe(
        map((request) => request.data.forms),
        map((forms) => forms.map((form) => AppForm.fromJson(form))),
        tap((forms) => {
          if (forms.length === 0) {
            return this.toast.alert({
              detail:
                'No se encontró un formulario definido para esta colección.',
            });
          }
        })
      )
    );
  }

  updateFormKeys(id: string, keys: string[]) {
    return this.updateForm(id, { keys });
  }

  private updateForm(id: string, data: Partial<IForm>): Promise<AppForm> {
    data._id = id;
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.updateForm,
      { updateFormInput: data },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation).pipe(
        map((request) => request.data.updateForm),
        map((form) => AppForm.fromJson(form))
      )
    );
  }

  createFormSubscription(
    args: CreateSubscriptionInput
  ): Promise<IFormSubscription> {
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.createFormSubscription,
      { createFormSubscriptionInput: args },
      [],
      { auth: true }
    );
    return firstValueFrom(
      this.graphql
        .mutation(refMutation)
        .pipe(map((request) => request.data.createFormSubscription))
    );
  }

  closeFormSubscription(id: string): Promise<IFormSubscription> {
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.closeFormSubscription,
      { id },
      [],
      { auth: false }
    );
    return firstValueFrom(
      this.graphql
        .mutation(refMutation)
        .pipe(map((request) => request.data.closeFormSubscription))
    );
  }

  listenFormSubscription(id: string): Observable<IFormSubscription> {
    return this.graphql
      .subscribeRequest(formQueries.subscription.listenFormSubscription, { id })
      .pipe(map((request) => request.data.listenFormSubscription));
  }

  openAnnouncementFromSubscription(
    announcement: Announcement,
    participantId: string,
    subscription?: IFormSubscription
  ) {
    let frameUrl = `${formUrls.announcement}/${announcement._id}/${participantId}`;
    if (subscription) {
      frameUrl = frameUrl.concat(`?sub=${subscription._id}`);
    }
    window.open(frameUrl, '_blank');
  }

  openFormFromSubscription(
    formSubscription: IFormSubscription,
    title: string = 'Formulario'
  ) {
    const frameUrl = `${formUrls.renderer}/${formSubscription._id}`;
    return this.openFormFromSubscriptionDialog(
      formSubscription,
      title,
      frameUrl
    );
  }

  openFormFromSubscriptionDialog(
    formSubscription: IFormSubscription,
    title: string,
    frameUrl: string
  ): Observable<string | null> {
    const idSubscription: string = formSubscription._id;
    const isEdit: boolean = !!formSubscription.doc;
    const ref = this.dialogService.open(FormRendererComponent, {
      modal: true,
      width: '95%',
      height: '100vh',
      data: {
        idSubscription,
        iframe: frameUrl,
      },
      header: title,
      showHeader: true,
    });
    ref.onClose.pipe(take(1)).subscribe((doc?: string) => {
      if (doc) {
        const message = isEdit
          ? 'Documento editado con éxito'
          : 'Documento diligenciado con éxito';
        this.toast.success({
          detail: message,
        });
      }
    });
    return ref.onClose;
  }

  openFormPreview(id: string, formName: string) {
    const ref = this.dialogService.open(FormViewComponent, {
      modal: true,
      width: '95%',
      height: '100vh',
      data: {
        iframe: `${environment.forms}form/view/${id}`,
      },
      header: `Vista previa ${formName}`,
      showHeader: true,
    });
    return ref.onClose;
  }

  async openFormApp() {
    const code = await this.authCodeService.createAuthCode();
    const formAppUrl = `${environment.forms}session/authorize?code=${code._id}`;
    window.open(formAppUrl, '_blank');
  }

  getFormComponents(formulario) {
    return JSON.parse(formulario.formJson).components;
  }

  getInputComponents(components: any[]): any[] {
    // const notInputComponents = ['datamap', 'editgrid', 'datagrid', 'button', 'content'];
    // return components.filter(c => notInputComponents.includes(c.type));
    let headers = [];
    //TODO: TRY TO ONLY FETCH DROPDOWNS OPTIONS WHEN CREATING THE EXCEL FILES
    //FOR DATA VALIDATION ON COMPONENTS OF TYPE SELECT
    // const usefulComponents = components.filter((comp) => comp.type != 'button');
    for (let index = 0; index < components.length; index++) {
      const comp = components[index];
      switch (comp.type) {
        default:
          headers.push({
            label: comp.label,
            key: comp.key,
            type: comp.type,
          });
          break;
        //layout non-containers components should be ignored
        case 'button':
        case 'content':
          break;
        case 'datetime':
          headers.push({
            label: comp.label,
            key: comp.key,
            config: {
              numFmt: comp.format,
            },
            type: comp.type,
          });
          break;
        case 'select':
          headers.push({
            label: comp.label,
            key: comp.key,
            type: comp.type,
          });
          break;
        case 'datamap':
        case 'editgrid':
        case 'datagrid':
          let innerHeaders = this.getInputComponents(comp.components);
          const composedField = {
            key: comp.key,
            type: comp.type,
            childs: innerHeaders,
            label: comp.label,
          };
          headers.push(composedField);
          // headers = headers.concat(innerHeaders);
          break;
      }
    }
    return headers;
  }
}
