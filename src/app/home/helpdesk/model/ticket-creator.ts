import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ticket } from './ticket.model';
import { Startup } from '../../../shared/models/entities/startup';
import { TicketStates } from '../enum/ticket-status.enum';
import { TicketCategory } from '../enum/ticket-category.enum';

export function newTicket(previous?: Ticket) {
  return new FormGroup({
    _id: new FormControl<string>(previous ? previous._id : ''),
    title: new FormControl<string>(previous ? previous.title : '', {
      validators: [Validators.required],
    }),
    body: new FormControl<string>(previous ? previous.childs[0].body : '', {
      validators: [Validators.required],
    }),
    category: new FormControl<TicketCategory>(
      previous ? previous.category : TicketCategory.support,
      {
        validators: [Validators.required],
      }
    ),
  });
}
