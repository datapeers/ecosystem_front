import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  reports = [
    {
      name: 'Reporte general',
      date: new Date(),
      url: 'https://ecometabase.vinku.co/public/dashboard/2ecda5f7-bb7d-4be1-95d8-5065bdf0d2d6',
    },
  ];
  urlSafe;

  constructor(public sanitizer: DomSanitizer) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.reports[0].url
    );
  }

  goReport(report) {}
}
