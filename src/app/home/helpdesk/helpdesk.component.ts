import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { hexToRgb } from '@shared/utils/hexToRgb';
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
  textSummary = `Mostrando {first} a {last} de {totalRecords}`;
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
  showFileUploadUI = false;
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
  @ViewChild('dt', { static: true }) dt: Table;
  constructor(
    private toast: ToastService,
    private store: Store<AppState>,
    private service: HelpdeskService,
    private readonly storageService: StorageService,
    private confirmationService: ConfirmationService
  ) {
    this.filtersTickets.valueChanges.subscribe((data) => {
      this.filterTicketsFunction(data as any);
    });
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.tickets$?.unsubscribe();
  }

  async loadComponent() {
    this.loaded = false;
    await firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
    if (this.user.isUser) {
      this.profileDoc = await firstValueFrom(
        this.store
          .select((store) => store.auth.profileDoc)
          .pipe(first((i) => i !== null))
      );
      if (this.user.isUser) this.startup = this.profileDoc.startups[0];
    }
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
    this.showFileUploadUI = false;
  }

  openCreatorTicket() {
    this.newTicket = newTicket();
    this.response = newResponse(this.user);
    this.selectedFiles = [];
    this.showCreatorTicket = true;
    this.showFileUploadUI = false;
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
        startupId: this.startup ? this.startup._id : this.profileDoc._id,
        startupName: this.startup
          ? this.startup.item['nombre']
          : this.profileDoc.item['nombre'],
        category: this.newTicket.value.category,
      })
      .then((ans) => {
        this.showCreatorTicket = false;
        this.filtersTickets.get('category').setValue(ans.category);
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
    console.log(key);
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
        this.showTicket.childs.push({ ...this.response.value });
      })
      .catch((err) => {
        this.toast.clear();
        console.warn(err);
        this.toast.error({ summary: 'Error al responder ticket', detail: err });
      });
  }

  async closeTicket() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Cerrar ticket',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que desea cerrar el ticket?',
      message:
        'Al cerrar el ticket, este se archivara y no permitirá ningún cambio',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Archivando...' });
        this.service
          .updateTicket({
            _id: this.showTicket._id,
            status: this.ticketsStates.Closed,
          })
          .then((ans) => {
            this.showTicket = false;
            this.toast.clear();
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar cerrar ticket',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  async deleteTicket() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '',
      message: '¿Está seguro de que desea eliminar el ticket?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteTicket(this.showTicket._id)
          .then((ans) => {
            this.showTicket = false;
            this.toast.clear();
            this.toast.success({
              detail: 'El ticket ha sido eliminado exitosamente',
              summary: 'Etapa eliminado!',
              life: 2000,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar ticket',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  allowDelete(ticket: Ticket) {
    if (!ticket) return false;
    if (ticket.status === this.ticketsStates.Closed) return false;
    if (this.user.isUser && ticket.startupId !== this.startup._id) return false;
    if (this.user.isExpert && ticket.startupId !== this.profileDoc._id)
      return false;
    return true;
  }

  paginatorRightMsg() {
    if (!this.dt) return '';
    return `Pagina ${Math.ceil(this.dt._first / this.dt._rows) + 1} de ${
      Math.floor(this.dt._totalRecords / this.dt._rows) + 1
    }`;
  }

  colorWithOpacity(color: string, opacity: number) {
    const colorRgb = hexToRgb(color);
    const style = `rgba(${colorRgb.r},${colorRgb.g},${colorRgb.b}, ${opacity})`;
    return style;
  }
}
