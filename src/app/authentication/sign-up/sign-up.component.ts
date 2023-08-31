import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '@shared/forms/custom-validators';
import { InvitationService } from '@shared/services/invitation.service';
import { ToastService } from '@shared/services/toast.service';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  invitationCode: string;
  onDestroy$: Subject<void> = new Subject();
  footerText = 'Startup factory - All rights reserved 2023 ©';
  loading = false;
  get formControls() {
    return this.signUpForm.controls;
  }
  constructor(
    private toast: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly invitationService: InvitationService,
    private readonly store: Store<AppState>
  ) {
    this.invitationCode = this.route.snapshot.queryParamMap.get('code');
    this.signUpForm = new FormGroup(
      {
        name: new FormControl<string>('', {
          validators: [Validators.required],
        }),
        password: new FormControl<string>('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl<string>('', {
          validators: [Validators.required],
        }),
      },
      {
        validators: [
          CustomValidators.MatchValidator('confirmPassword', 'password'),
        ],
      }
    );

    // TODO: Make sure the user is logged out with a guard before he can access the sign up component
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

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      evt.preventDefault();
      this.onSubmit();
    }
  }

  async onSubmit() {
    if (this.signUpForm.invalid) {
      this.toast.alert({
        summary: 'Falta campos',
        detail:
          'Es necesario diligenciar todos los campos para completar el registro',
      });
      return;
    }
    const { name, password } = this.signUpForm.value;
    this.loading = true;
    const result = await this.invitationService.acceptInvitation(
      this.invitationCode,
      name,
      password
    );
    const email = result.email;
    await this.authService.signIn(email, password);
    this.toast.redirecting();
    this.loading = false;
  }

  async googleAuth() {
    const result = await this.authService.signUpGoogle();
    if (result) {
      const resultInvitation = await this.invitationService.acceptInvitation(
        this.invitationCode,
        (result.additionalUserInfo.profile as any).name,
        'googleInMethod'
      );
    }
  }
}
