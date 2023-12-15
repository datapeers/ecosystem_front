import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ticket } from './ticket.model';
import { Startup } from '../../../shared/models/entities/startup';
import { TicketStates } from '../enum/ticket-status.enum';
import { TicketCategory } from '../enum/ticket-category.enum';
import { User } from '@auth/models/user';

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

export function newResponse(user: User, ticket?: Ticket) {
  return new FormGroup({
    body: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    attachment: new FormControl<any[]>([], {}),
    isResponse: new FormControl<boolean>(
      ticket ? ticket.childs[0].answerById !== user._id : false,
      {
        validators: [Validators.required],
      }
    ),
    answerBy: new FormControl<string>(user.fullName, {
      validators: [Validators.required],
    }),
    answerById: new FormControl<string>(user._id, {
      validators: [Validators.required],
    }),
  });
}
