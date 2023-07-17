import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, UrlTree } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';
import { Store } from '@ngrx/store';
import { ToastService } from '@shared/services/toast.service';
import { Observable, first, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanMatch {
  constructor(
    private readonly store: Store<AppState>,
    private readonly toast: ToastService,
    private readonly authService: AuthService
  ) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.store
      .select((state) => state.auth.user)
      .pipe(
        first((user) => user != null),
        map((user) => {
          const validRoles = route.data?.['roles'] ?? [];
          if (validRoles.length === 0) {
            console.error(
              "The selected route its protected but doesn't have roles configured"
            );
            return false;
          }
          if (validRoles.includes(user.rolType)) {
            return true;
          }
          this.toast.alert({
            summary: 'Rol invalido',
            detail:
              'La sección que esta tratando de ver no esta permitida para su rol actual',
          });
          console.warn('Your rol can`t access in this route');
          return false;
        })
      );
  }
}
