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
import { newResponse, newTicket } from './model/ticket-creator';
import { ToastService } from '@shared/services/toast.service';
import { Ticket } from './model/ticket.model';
import { StorageService } from '@shared/storage/storage.service';
import { HttpEventType } from '@angular/common/http';
import FileSaver from 'file-saver';
import { IFileUpload, IFileUploadExtended } from '@shared/models/file';
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
  response: FormGroup;
  // Files
  selectedFiles: { name: string; url?: string; file?: File }[] = [];
  fileSizeLimit = 500000;

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
    private service: HelpdeskService,
    private readonly storageService: StorageService
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

  display(ticket) {
    this.showTicket = ticket;
    this.response = newResponse(this.user, ticket);
    this.selectedFiles = [];
  }

  openCreatorTicket() {
    this.newTicket = newTicket();
    this.response = newResponse(this.user);
    this.selectedFiles = [];
    this.showCreatorTicket = true;
  }

  async createTicket() {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    await this.uploadFiles();
    this.service
      .createTicket({
        title: this.newTicket.value.title,
        newChild: {
          ...this.response.value,
          body: this.newTicket.value.body,
        },
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

  async uploadFiles() {
    const attachment: IFileUpload[] = [];
    for (const iterator of this.selectedFiles) {
      this.toast.clear();
      this.toast.info({
        summary: 'Subiendo archivo...',
        detail: 'Por favor espere, no cierre la ventana',
      });
      if (iterator.file) {
        const fileUploaded: any = await firstValueFrom(
          this.storageService
            .uploadFile(`tickets/${this.user._id}/`, iterator.file)
            .pipe(first((event) => event.type === HttpEventType.Response))
        );
        attachment.push({
          name: iterator.name,
          url: fileUploaded.url,
        });
      } else {
        attachment.push({
          name: iterator.name,
          url: iterator.url,
        });
      }
    }
    this.response.get('attachment').setValue(attachment);
    this.toast.clear();
  }

  onUpload(event, target) {
    for (let newFile of event.files as File[]) {
      if (!this.selectedFiles.some((f) => f.name == newFile.name)) {
        this.selectedFiles.push({
          file: newFile,
          name: newFile.name,
        });
      }
    }
    target.clear();
  }

  removeFile(fileName: string) {
    if (this.selectedFiles) {
      this.selectedFiles = this.selectedFiles.filter((f) => f.name != fileName);
    }
  }

  async downloadUrl(urlFile: string) {
    const key = this.storageService.getKey(urlFile);
    const url = await firstValueFrom(this.storageService.getFile(key));
    if (url) {
      window.open(url, '_blank');
    }
  }

  async downloadFile(file: IFileUploadExtended) {
    if (file.file) {
      FileSaver.saveAs(file.file);
      return;
    }
  }

  async sendResponse() {
    await this.uploadFiles();
    this.toast.info({ summary: 'Enviando respuesta', detail: '' });
    this.service
      .updateTicket({
        _id: this.showTicket._id,
        childs: [...this.showTicket.childs, { ...this.response.value }],
      })
      .then((ans) => {
        this.toast.clear();
        this.showTicket = undefined;
      })
      .catch((err) => {
        this.toast.clear();
        console.warn(err);
        this.toast.error({ summary: 'Error al responder ticket', detail: err });
      });
  }
}
