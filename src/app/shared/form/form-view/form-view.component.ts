import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent {
  idSubscription: string;
  urlSafe: SafeResourceUrl;
  constructor(
    public ref: DynamicDialogRef,
    public sanitizer: DomSanitizer,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    const { iframe } = this.config.data;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(iframe);
  }

  async close() {
    this.ref.close();
  }
}
