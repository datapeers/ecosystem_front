import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReportsService } from './reports.service';
import { Report } from './model/report.model';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormViewComponent } from '@shared/form/form-view/form-view.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  // reports = [
  //   {
  //     name: 'Reporte general',
  //     date: new Date(),
  //     url: 'https://ecometabase.vinku.co/public/dashboard/2ecda5f7-bb7d-4be1-95d8-5065bdf0d2d6',
  //   },
  // ];
  urlSafe;
  reports: Report[] = [];
  loaded = false;

  constructor(
    public sanitizer: DomSanitizer,
    private readonly reportService: ReportsService,
    private readonly toast: ToastService,
    private readonly dialogService: DialogService
  ) {
    // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   this.reports[0].url
    // );
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  async loadComponent() {
    this.reports = await this.reportService.getAllReports();
    this.loaded = true;
  }

  goReport(report: Report) {
    this.toast.loading();
    this.reportService
      .getReport(report._id)
      .then((ans) => {
        this.toast.clear();
        this.openPreview(report);
      })
      .catch((err) =>
        this.toast.error({ detail: err, summary: 'Error al cargar informe' })
      );
  }

  openPreview(report: Report) {
    const ref = this.dialogService.open(FormViewComponent, {
      modal: true,
      width: '95%',
      height: '100vh',
      data: {
        iframe: `${report.url}`,
      },
      header: `${report.name}`,
      showHeader: true,
    });
    return ref.onClose;
  }
}
