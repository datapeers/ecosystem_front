import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as fromAuth from './auth.actions';
import { UserService } from '@auth/user.service';
import { AppState } from '@appStore/app.reducer';
import { Store } from '@ngrx/store';
import { FailUpdateUserAction, UpdateUserAction } from '@auth/store/auth.actions';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private userService: UserService,
  ) {}

  updateUserImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.UPDATE_USER_IMAGE),
      switchMap(async (action: fromAuth.UpdateUserImageAction) => {
        const user = await firstValueFrom(this.store.select(state => state.auth.user));
        const imageUrl = action.imageUrl;
        var result = await this.userService.updateUser(user._id, { profileImageUrl: imageUrl })
        .then(updatedUser => {
          return new UpdateUserAction(updatedUser);
        })
        .catch(ex => {
          return new FailUpdateUserAction("Failed to update user profile image");
        });
        return result;
      })
    )
  );
}
