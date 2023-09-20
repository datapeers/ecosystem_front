import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { firstValueFrom, first, Subscription } from 'rxjs';
import { User } from '@auth/models/user';
import { Startup } from '@shared/models/entities/startup';
import { newTicket } from './model/ticket-creator';
import { ToastService } from '@shared/services/toast.service';
import { Ticket } from './model/ticket.model';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss'],
  providers: [{ provide: DocumentProvider, useExisting: HelpdeskService }],
})
export class HelpdeskComponent implements OnInit, OnDestroy {
  user: User;
  loaded = false;
  profileDoc;
  startup: Startup;

  filtersTickets = new FormGroup({
    category: new FormControl(TicketCategory.support),
    status: new FormControl(TicketStates.Open),
  });

  categories = ticketCategoryObj;
  status = ticketStatesObj;
  ticketsContext: TicketContext;

  optionsTable: TableOptions;

  newTicket: FormGroup;
  showCreatorTicket = false;

  tickets$: Subscription;
  tickets: Ticket[] = [];
  showedTickets: Ticket[] = [];
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

  public get ticketsStatesNames(): typeof ticketStatesNames {
    return ticketStatesNames;
  }

  public get ticketsStatesColors(): typeof ticketStatesColors {
    return ticketStatesColors;
  }

  public get TicketCategory(): typeof TicketCategory {
    return TicketCategory;
  }

  public get ticketCategoryColors(): typeof ticketCategoryColors {
    return ticketCategoryColors;
  }

  public get ticketCategoryNames(): typeof ticketCategoryNames {
    return ticketCategoryNames;
  }

  constructor(
    private toast: ToastService,
    private store: Store<AppState>,
    private service: HelpdeskService
  ) {
    this.filtersTickets.valueChanges.subscribe((data) => {
      this.filterTicketsFunction(data as any);
    });
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.tickets$?.unsubscribe();
  }

  async loadComponent() {
    this.loaded = false;
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    if (this.user.isUser) this.startup = this.profileDoc.startups[0];
    this.service
      .watchTickets({
        isDeleted: false,
      })
      .then((tickets$) => {
        this.loaded = false;
        this.tickets$ = tickets$.subscribe((ticketsList) => {
          this.tickets = ticketsList.map((i) => Ticket.fromJson(i));
          this.filterTicketsFunction(this.filtersTickets.value as any);
          this.loaded = true;
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar tickets',
          detail: err,
          life: 12000,
        });
      });
  }

  filterTicketsFunction(data: {
    category: TicketCategory;
    status: TicketStates;
  }) {
    console.log(this.showedTickets);
    this.showedTickets = this.tickets.filter(
      (i) => i.category === data.category
    );
    console.log(this.showedTickets);
    this.showedTickets = this.showedTickets.sort((ticketA, ticketB) => {
      // Comparar los estados de los tickets
      if (ticketA.status === data.status && ticketB.status !== data.status) {
        return -1; // ticketA va antes que ticketB
      } else if (
        ticketA.status !== data.status &&
        ticketB.status === data.status
      ) {
        return 1; // ticketB va antes que ticketA
      } else {
        return 0; // No se cambian de posición
      }
    });
  }

  display(thicket) {
    this.showTicket = thicket;
    this.response = {
      body: '',
      attachment: [],
      isResponse: true,
      answerBy: '',
    };
  }

  openCreatorTicket() {
    this.newTicket = newTicket();
    this.showCreatorTicket = true;
  }

  async createTicket() {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .createTicket({
        title: this.newTicket.value.title,
        newChild: { body: this.newTicket.value.body, attachment: [] },
        startupId: this.startup._id,
        startupName: this.startup.item['nombre'],
        category: this.newTicket.value.category,
      })
      .then((ans) => {
        this.showCreatorTicket = false;
        this.toast.clear();
      })
      .catch((err) => {
        console.warn(err);
        this.toast.clear();
        this.toast.error({ summary: 'Error al crear ticket', detail: err });
      });
  }

  passFilters;
}
