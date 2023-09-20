import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ticket } from './ticket.model';
import { Startup } from '../../../shared/models/entities/startup';
import { TicketStates } from '../enum/ticket-status.enum';
import { TicketCategory } from '../enum/ticket-category.enum';

export function newTicket() {
  return new FormGroup({
    title: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    body: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    category: new FormControl<TicketCategory>(TicketCategory.support, {
      validators: [Validators.required],
    }),
  });
}
