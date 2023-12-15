import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Subject, first, firstValueFrom, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  onDestroy$: Subject<void> = new Subject();
  recoverPsw = new FormControl(null, [Validators.email]);
  rememberPsw = false;
  blockSpace: RegExp = /[^s]/;
  footerText = 'Ecosystem - All rights reserved 2023 ©';
  loading = false;
  get formControls() {
    return this.loginForm.controls;
  }
  constructor(
    private router: Router,
    private toast: ToastService,
    private store: Store<AppState>,
    public authService: AuthService,
    private routerAct: ActivatedRoute
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
        if (auth.logged) this.verify_route();
      });
  }

  initForm() {
    this.loginForm = new FormGroup({
      login: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      evt.preventDefault();
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
    this.loading = true;
    this.authService
      .signIn(this.loginForm.value.login, this.loginForm.value.password)
      .then(() => {
        this.toast.clear();
        this.toast.redirecting();
        return;
      })
      .catch((err) => {
        this.loading = false;
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

  openRecoverPsw() {
    this.recoverPsw.setValue(this.loginForm.value.login);
    this.rememberPsw = true;
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

  async verify_route(): Promise<void> {
    if (this.router.url.indexOf('/sign-in') !== -1) {
      const lastRoute = await firstValueFrom(
        this.routerAct.queryParams.pipe(take(1))
      );
      if (lastRoute['returnUrl']) {
        this.router.navigateByUrl(lastRoute['returnUrl']);
      } else {
        this.router.navigate(['/home/inicio']);
      }
    }
  }
}
