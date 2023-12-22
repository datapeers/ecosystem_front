import { Component } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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

  constructor(
    public config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef,
    private toast: ToastService
  ) {}
  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  async loadComponent() {}
}
