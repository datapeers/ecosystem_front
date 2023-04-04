import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastService } from '@shared/services/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { ClearAuthStoreAction, SetUserAction } from '@auth/store/auth.actions';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = null;
  private authStatusSub = new BehaviorSubject(this.currentUser);

  constructor(
    public fireAuth: AngularFireAuth,
    public toast: ToastService,
    private store: Store<AppState>,
    private router: Router,
    private userService: UserService,
  ) {
    this.authStatusListener();
  }

  authStatusListener() {
    this.fireAuth.authState.subscribe(async (credential) => {
      if (credential) {
        const userData = await this.userService.getUserByUid(credential.uid);
        this.store.dispatch(new SetUserAction(userData));
        this.authStatusSub.next(true);
      } else {
        this.authStatusSub.next(null);
        this.signOut();
      }
    });
  }

  signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    sessionStorage.clear();
    this.store.dispatch(new ClearAuthStoreAction());
    this.router.navigate(['/sign-in']);
    this.fireAuth.signOut();
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  async fireAuthError(code: string, error?: any, email?: string) {
    let msg = '';
    switch (code) {
      case 'auth/id-token-expired':
        msg = 'El token de ID de Firebase que se proporcionó está vencido.';
        break;
      case 'auth/invalid-argument':
        msg =
          'Se proporcionó un argumento no válido para un método de autenticación. El mensaje de error debe incluir información adicional.';
        break;
      case 'auth/wrong-password':
        msg =
          'Verifique que el usuario o contraseña sean correctos o pruebe ingresando por Google/Microsoft';
        if (email) {
          // const user = await this.searchUserByEmail(email);
          // if (user.logIn !== 'email/psw') {
          msg = `La cuenta de ${email} tiene que ingresar por medio de`;
          // }
        }
        break;
      case 'auth/user-not-found':
        msg =
          'No existe ningún registro de usuario que corresponda al correo proporcionado.';
        break;
      case 'auth/too-many-requests':
        msg =
          'El acceso a esta cuenta se ha desactivado temporalmente debido a muchos intentos fallidos de inicio de sesión. Puede restablecerlo inmediatamente restableciendo su contraseña o puede volver a intentarlo más tarde';
        break;
      default:
        msg = error;
        break;
    }
    this.toast.clear();
    this.toast.error({
      summary: 'Error al intentar ingresar',
      detail: msg,
      life: 5000,
    });
  }
}
