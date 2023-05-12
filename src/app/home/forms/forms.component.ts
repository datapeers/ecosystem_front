import { Component } from '@angular/core';
import { FormService } from '@shared/form/form.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private readonly formService: FormService,
  ) {

  }

  async openFormApp() {
    this.formService.openFormApp();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
