import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree, } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly router: Router,
  ) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.afAuth.user.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        }
        this.router.navigate(['/sign-in'], { queryParams: { returnUrl: this.router.getCurrentNavigation().initialUrl } });
        return false;
      })
    );
  }
}
