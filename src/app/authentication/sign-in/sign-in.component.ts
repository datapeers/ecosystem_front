import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Subject, first, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm: UntypedFormGroup;
  onDestroy$: Subject<void> = new Subject();
  recoverPsw = new FormControl(null, [Validators.email]);
  rememberPsw = false;
  blockSpace: RegExp = /[^s]/;
  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private toast: ToastService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.initComponent();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  initComponent() {
    this.store
      .select((state) => state.auth)
      .pipe(
        first((state) => state.logged),
        takeUntil(this.onDestroy$)
      )
      .subscribe(async (auth) => {
        if (auth.logged) this.router.navigate(['/home']);
      });
  }

  initForm() {
    this.loginForm = new UntypedFormGroup({
      login: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (!this.loginForm.valid) return;
    this.toast.info({
      summary: 'Iniciando sesión',
      detail: 'Validando sus datos, un momento por favor...',
      life: 12000,
      closable: false,
    });
    this.authService
      .signIn(this.loginForm.value.login, this.loginForm.value.password)
      .then(() => {
        this.toast.clear();
        return;
      })
      .catch((err) => {
        this.authService.fireAuthError(
          err.code,
          err.message,
          this.loginForm.value.login
        );
        return;
      });
  }

  logInWithGoogle() {
    return this.authService.signInGoogle();
  }

  async sendRememberPsw(): Promise<void> {
    try {
      const request = await this.authService.sendPasswordResetEmail(
        this.recoverPsw.value
      );
      this.toast.info({
        summary: 'Correo de recuperación enviado', // "email-sent" : "Correo de recuperación enviado"
        detail: '',
      });
      this.rememberPsw = false;
    } catch (error) {
      console.warn(error);
      this.toast.error({
        summary: 'No se pudo enviar el email', //"email-not-sent" : "No se pudo enviar el email",
        detail: 'Es posible que este email no se encuentre registrado', // "email-not-registered" : "Es posible que este email no se encuentre registrado"
      });
    }
  }
}
