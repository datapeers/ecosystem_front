import { Component } from '@angular/core';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  constructor(
    private readonly authService: AuthService,
  ) {

  }

  logout() {
    this.authService.signOut();
  }
}
