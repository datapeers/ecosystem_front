import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { map, take, tap } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
import { AppForm, IForm } from './models/form';
import formQueries from './form.gql';
import { FormCollections } from './enums/form-collections';
import { IFormSubscription } from './models/form-subscription';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { CreateSubscriptionArgs as CreateSubscriptionInput } from './models/create-subscription.input';
import { ToastService } from '@shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly dialogService: DialogService,
    private readonly toast: ToastService,
  ) {}

  getForm(id: string): Promise<AppForm> {
    const refQuery = this.graphql.refQuery(
      formQueries.query.form,
      { id },
      'no-cache',
      { auth: false }
    );
    return firstValueFrom(
      this.graphql.query(refQuery)
      .pipe(
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
      this.graphql.query(refQuery)
      .pipe(
        map((request) => request.data.forms),
        map((forms) => forms.map(form => AppForm.fromJson(form)))
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
      { auth: true },
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation)
      .pipe(
        map((request) => request.data.updateForm),
        map((form) => AppForm.fromJson(form))
      )
    );
  }

  createFormSubscription(args: CreateSubscriptionInput): Promise<IFormSubscription> {
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.createFormSubscription,
      { createFormSubscriptionInput: args },
      [],
      { auth: true },
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation)
      .pipe(
        map((request) => request.data.createFormSubscription),
      )
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
      this.graphql.mutation(refMutation)
      .pipe(
        map((request) => request.data.closeFormSubscription),
      )
    );
  }

  listenFormSubscription(id: string): Observable<IFormSubscription> {
    return this.graphql.subscribeRequest(formQueries.subscription.listenFormSubscription, { id })
    .pipe(
      map((request) => request.data.listenFormSubscription),
    );
  }

  openFormFromSubscription(formSubscription: IFormSubscription, title: string = "Formulario"): Observable<string | null> {
    const idSubscription: string = formSubscription._id;
    const isEdit: boolean = !!formSubscription.doc;
    const ref = this.dialogService.open(FormRendererComponent, {
      modal: true,
      width: '95%',
      height: '100vh',
      data: {
        idSubscription,
        iframe: `${environment.forms}form/renderer/${idSubscription}`,
      },
      header: title,
      showHeader: true,
    });
    ref.onClose
    .pipe(take(1))
    .subscribe((doc?: string) => {
      if(doc) {
        const message = isEdit ? 'Documento editado con éxito' : 'Documento creado con éxito'
        this.toast.success({
          detail: message
        });
      }
    });
    return ref.onClose;
  }
}
