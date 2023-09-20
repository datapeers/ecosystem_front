import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketContext } from './model/TicketContext.model';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { HelpdeskService } from './helpdesk.service';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { tableLocators } from '@shared/components/dynamic-table/locators';
import {
  TicketStates,
  ticketStatesNames,
  ticketStatesColors,
  ticketStatesObj,
} from './enum/ticket-status.enum';
import {
  TicketCategory,
  ticketCategoryColors,
  ticketCategoryNames,
  ticketCategoryObj,
} from './enum/ticket-category.enum';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: HelpdeskService }],
})
export class HelpdeskComponent {
  formFilterCategory = new FormGroup({
    category: new FormControl(''),
    status: new FormControl(''),
  });

  categories = ticketCategoryObj;
  status = ticketStatesObj;
  ticketsContext: TicketContext;

  optionsTable: TableOptions;

  tickets = [
    {
      _id: '1',
      title: 'Título 1',
      status: 'Opened',
      childs: [
        {
          body: 'Cuerpo del elemento 1',
          attachment: ['archivo1.pdf', 'imagen1.jpg'],
          isResponse: true,
          answerBy: 'Usuario 1',
        },
      ],
      startupId: 'startup1',
      startupName: 'Startup A',
      category: {
        _id: 'cat1',
        name: 'Categoría 1',
        color: 'Azul',
      },
      createdAt: '2023-09-05T12:00:00Z',
    },
    {
      _id: '1',
      title: 'Título 1',
      status: 'Opened',
      childs: [
        {
          body: 'Cuerpo del elemento 1',
          attachment: ['archivo1.pdf', 'imagen1.jpg'],
          isResponse: true,
          answerBy: 'Usuario 1',
        },
      ],
      startupId: 'startup1',
      startupName: 'Startup A',
      category: {
        _id: 'cat1',
        name: 'Categoría 1',
        color: 'Azul',
      },
      createdAt: '2023-09-05T12:00:00Z',
    },
    {
      _id: '1',
      title: 'Título 1',
      status: 'Opened',
      childs: [
        {
          body: 'Cuerpo del elemento 1',
          attachment: ['archivo1.pdf', 'imagen1.jpg'],
          isResponse: true,
          answerBy: 'Usuario 1',
        },
      ],
      startupId: 'startup1',
      startupName: 'Startup A',
      category: {
        _id: 'cat1',
        name: 'Categoría 1',
        color: 'Azul',
      },
      createdAt: '2023-09-05T12:00:00Z',
    },
    {
      _id: '1',
      title: 'Título 1',
      status: 'Opened',
      childs: [
        {
          body: 'Cuerpo del elemento 1',
          attachment: ['archivo1.pdf', 'imagen1.jpg'],
          isResponse: true,
          answerBy: 'Usuario 1',
        },
      ],
      startupId: 'startup1',
      startupName: 'Startup A',
      category: {
        _id: 'cat1',
        name: 'Categoría 1',
        color: 'Azul',
      },
      createdAt: '2023-09-05T12:00:00Z',
    },
    {
      _id: '1',
      title: 'Título 1',
      status: 'Opened',
      childs: [
        {
          body: 'Cuerpo del elemento 1',
          attachment: ['archivo1.pdf', 'imagen1.jpg'],
          isResponse: true,
          answerBy: 'Usuario 1',
        },
      ],
      startupId: 'startup1',
      startupName: 'Startup A',
      category: {
        _id: 'cat1',
        name: 'Categoría 1',
        color: 'Azul',
      },
      createdAt: '2023-09-05T12:00:00Z',
    },
  ];

  cols = [
    { field: 'category.name', header: 'Categoría' },
    { field: 'title', header: 'Título' },
    { field: 'status', header: 'Estado' },
    { field: 'createdAt', header: 'Fecha' },
  ];

  showTicket;
  titleDialog;
  response = {
    body: '',
    attachment: [],
    isResponse: true,
    answerBy: '',
  };
  public get ticketsStates(): typeof TicketStates {
    return TicketStates;
  }

  public get ticketsStatesColors(): typeof ticketStatesColors {
    return ticketStatesColors;
  }

  constructor(
    private store: Store<AppState>,
    private service: HelpdeskService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {}

  display(thicket) {
    this.showTicket = thicket;
    this.response = {
      body: '',
      attachment: [],
      isResponse: true,
      answerBy: '',
    };
  }
}
