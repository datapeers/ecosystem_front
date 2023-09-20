import { TicketCategory } from '../enum/ticket-category.enum';
import { TicketStates } from '../enum/ticket-status.enum';
import { ITicketCategory } from './ticket-category.model';
import { catchError } from 'rxjs';

export interface ITicket {
  _id: string;
  title: string;
  status: string;
  childs: ITicketChild[];
  startupId: string;
  startupName: string;
  category: TicketCategory;
  createdAt: Date;
}

export interface ITicketChild {
  body: string;
  attachment: string[];
  isResponse: boolean;
  answerBy: string;
}

export class TicketChild implements ITicketChild {
  body: string;
  attachment: string[];
  isResponse: boolean;
  answerBy: string;
}

export class Ticket implements ITicket {
  _id: string;
  title: string;
  status: TicketStates;
  childs: ITicketChild[];
  startupId: string;
  startupName: string;
  category: TicketCategory;
  createdAt: Date;

  private constructor() {}

  static fromJson(data: ITicket): Ticket {
    const ticket = new Ticket();

    Object.assign(ticket, {
      _id: data._id,
      title: data.title,
      status: data.status,
      childs: data.childs,
      startupId: data.startupId,
      startupName: data.startupName,
      category: data.category,
      createdAt: data.createdAt,
    });

    return ticket;
  }
}
