import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../authentication/user.service';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { User } from '@shared/models/auth/user';
import { Subject, filter, takeUntil, tap } from 'rxjs';
import { UpdateUserImageAction } from '@auth/store/auth.actions';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '@auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@shared/forms/custom-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  onDestroy$: Subject<void> = new Subject();
  loaded: boolean = false;
  passwordDialog: boolean = false;
  changePasswordForm: FormGroup;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private store: Store<AppState>,
    private readonly fb: FormBuilder,
  ) {
    this.store
      .select((storeState) => storeState.auth.user)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(user => user !== null)
      )
      .subscribe((userState) => {
        this.user = userState;
      });
    
    this.changePasswordForm = fb.group(
      {
        currentPassword: fb.control<string>("", { nonNullable: true, validators: [ Validators.required ] }),
        newPassword: fb.control<string>("", { nonNullable: true, validators: [ Validators.required ] }),
        confirmNewPassword: fb.control<string>("", { nonNullable: true, validators: [ Validators.required, Validators.minLength(6) ] }),
      },
      { validators: [ CustomValidators.MatchValidator("confirmNewPassword", "newPassword") ] }
    );
  }

  
  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async loadComponent() {

  }

  imageSelected: any;
  selectFile(element: HTMLInputElement) {
    const files = element.files;
    if (files && files.item(0)) {
      this.upload(files.item(0));
    }
  }

  async upload(fileToUpload: File) {
    this.userService.updateProfileImage(this.user, fileToUpload)
    .pipe(
      tap((event) => {
        if(event.type === HttpEventType.DownloadProgress) {
          // Display upload progress if required
        }
      }),
    )
    .subscribe((event) => {
      if(event.type === HttpEventType.Response)
        this.store.dispatch(new UpdateUserImageAction(event.url));
    });
  }

  removeProfileImage() {
    this.userService.removeProfileImage(this.user)
      .subscribe((event) => {
        if(event.type === HttpEventType.Response) {
          this.store.dispatch(new UpdateUserImageAction(""));
        }
      });
  }

  openPasswordDialog() {
    this.changePasswordForm.reset();
    this.passwordDialog = true;
  }

  onKeyUp(evt: KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.onSubmit();
    }
  }

  async onSubmit() {
    if(this.changePasswordForm.invalid) return;
    this.passwordDialog = false;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    await this.authService.updateUserPassword(currentPassword, newPassword);
  }
}

