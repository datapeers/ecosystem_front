import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketContext } from './model/TicketContext.model';
import { DocumentProvider } from '@shared/components/dynamic-table/models/document-provider';
import { HelpdeskService } from './helpdesk.service';
import { TableOptions } from '@shared/components/dynamic-table/models/table-options';
import { tableLocators } from '@shared/components/dynamic-table/locators';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: HelpdeskService }],
})
export class HelpdeskComponent {
  formFilterCategory = new FormGroup({
    category: new FormControl('', [Validators.required]),
  });

  categories = [{ name: 'Acompañamientos', code: 'AC' }];
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
          isResposne: true,
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
          isResposne: true,
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
          isResposne: true,
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
          isResposne: true,
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
          isResposne: true,
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

  getSeverity(status: string) {
    console.log(status);
    switch (status) {
      case 'Opened':
        return 'success';
      case 'Inprogress':
        return 'warning';
      case 'Closed':
        return 'danger';
    }
    return '';
  }

  ngOnInit() {
    this.initData();
  }

  initData() {}
}
