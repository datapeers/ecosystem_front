import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  loginForm: UntypedFormGroup;
  storeSubscription: Subscription;
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
    this.storeSubscription?.unsubscribe();
  }

  initComponent() {
    this.storeSubscription = this.store
      .select('auth')
      .subscribe(async (auth) => {
        if (auth.logged) {
          this.router.navigate(['/home']);
        }
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
}
