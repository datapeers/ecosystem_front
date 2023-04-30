import { Component } from '@angular/core';
import { AuthCodeService } from '@auth/auth-code.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {
  token: string;
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private readonly authCodeService: AuthCodeService,
  ) {

  }

  async openFormApp() {
    const code = await this.authCodeService.createAuthCode();
    const formAppUrl = `${environment.forms}session/authorize?code=${code._id}`;
    window.open(formAppUrl, "_blank");
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
