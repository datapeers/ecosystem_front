import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation-user',
  templateUrl: './evaluation-user.component.html',
  styleUrls: ['./evaluation-user.component.scss'],
})
export class EvaluationUserComponent {
  evaluated = [
    {
      name: 'Raul Casanova',
      text: 0,
      rate: 0,
      notes: '',
    },
    {
      name: 'Sebastian Prada',
      text: 0,
      rate: 0,
      notes: '',
    },
  ];
}
