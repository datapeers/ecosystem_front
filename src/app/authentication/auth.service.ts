import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, debounceTime, filter } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastService } from '@shared/services/toast.service';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { ClearAuthStoreAction, SetUserAction } from '@auth/store/auth.actions';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = null;
  private authStatusSub = new BehaviorSubject(this.currentUser);
  renewToken$: Subject<void> = new Subject();

  constructor(
    public fireAuth: AngularFireAuth,
    public toast: ToastService,
    private store: Store<AppState>,
    private router: Router,
    private userService: UserService
  ) {
    this.authStatusListener();
    const tokenExpirationTime = 3540000; // 59 Minutos
    // Renew token subscription
    const delayedRenew = this.renewToken$.asObservable().pipe(debounceTime(tokenExpirationTime));
    combineLatest([this.fireAuth.authState, delayedRenew])
      .pipe(filter(([user]) => !!user))
      .subscribe(async ([user]) => {
        await user.getIdToken(true).then(() => {
          // Do anything when token gets renewed
        })
        .catch(reason => {
          // Failed to renew token sign out user
          console.error("Failed to renew account credentials, this may be due to network issues.")
          this.signOut();
        });
    });

    this.fireAuth.idToken
    .subscribe((idToken) => {
      if(idToken != null) {
        // Set trigger to renew token before expiration
        this.renewToken$.next();
      }
    });
  }

  authStatusListener() {
    this.fireAuth.authState.subscribe(async (credential) => {
      if (credential) {
        const userData = await this.userService.getUserByUid(credential.uid);
        this.store.dispatch(new SetUserAction(userData));
        this.authStatusSub.next(true);
      } else {
        this.authStatusSub.next(null);
      }
    });
  }

  signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    sessionStorage.clear();
    this.store.dispatch(new ClearAuthStoreAction());
    this.fireAuth.signOut();
    this.router.navigate(['/sign-in']);
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

  async updateUserPassword(currentPassword: string, newPassword: string) {
    // First, get the current user object from Firebase Authentication
    const user = await this.fireAuth.currentUser;
    // Next, reauthenticate the user with their current password
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );

    user.reauthenticateWithCredential(credentials).then(() => {
      // The user has been successfully reauthenticated with their current password
      // Now, update the user's password to a new value
      user.updatePassword(newPassword).then(() => {
        // The user's password has been successfully updated
        this.toast.success({
          summary: "Exitó",
          detail: "Contraseña actualizada con exito",
        });
      }).catch((error) => {
        // An error occurred while updating the user's password
        console.error(error);
        this.toast.error({
          summary: "Error",
          detail: "Fallo al intentar cambiar la contraseña",
        });
      });
    }).catch((error) => {
      console.error(error);
      this.toast.error({
        summary: "Error",
        detail: "Fallo al intentar validar la contraseña",
      });
      // An error occurred while reauthenticating the user with their current password
    });

  }
}
