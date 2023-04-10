import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, UrlTree } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { AuthService } from '@auth/auth.service';
import { Store } from '@ngrx/store';
import { ValidRoles } from '@shared/models/auth/valid-roles.enum';
import { Observable, first, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanMatch {
  constructor(
    private readonly store: Store<AppState>,
    private readonly authService: AuthService,
  ) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store
    .select(state => state.auth.user)
    .pipe(
      first(user => user != null),
      map(user => {
        const validRoles = route.data?.["roles"] ?? [];
        if(validRoles.length === 0) {
          console.error("The selected route its protected but doesnt have roles configured");
          return false;
        }
        const userRoles = user?.roles?? [];
        if(userRoles.some(role => validRoles.includes(role)))
          return true;
        this.authService.signOut();
        return false;
      })
    )
  }
}
