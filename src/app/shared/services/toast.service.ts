import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  key = 'toastAlert';
  constructor(private messageService: MessageService) {}

  success(msg: IToastMessage) {
    this.messageService.add({
      severity: 'success',
      key: this.key,
      ...msg,
    });
  }

  info(msg: IToastMessage) {
    this.messageService.add({
      severity: 'info',
      key: this.key,
      ...msg,
    });
  }

  alert(msg: IToastMessage) {
    this.messageService.add({
      severity: 'warn',
      key: this.key,
      ...msg,
    });
  }

  error(msg: IToastMessage) {
    this.messageService.add({
      severity: 'error',
      key: this.key,
      ...msg,
    });
  }

  clear(key?: string) {
    this.messageService.clear(key ?? this.key);
  }

  adminUser() {
    this.messageService.add({
      severity: 'info',
      key: this.key,
      summary: 'Acción bloqueada',
      detail: 'Solo se permite visualizar a las cuentas que no sean usuarios',
    });
  }
}

export interface IToastMessage {
  summary?: string;
  detail: string;
  life?: number;
  closable?: boolean;
}
