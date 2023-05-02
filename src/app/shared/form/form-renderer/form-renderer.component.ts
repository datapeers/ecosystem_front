import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormService } from '../form.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form-renderer',
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.scss']
})
export class FormRendererComponent {
  onDestroy$: Subject<void> = new Subject();
  idSubscription: string;
  urlSafe: SafeResourceUrl;
  constructor(
    public ref: DynamicDialogRef,
    public sanitizer: DomSanitizer,
    public config: DynamicDialogConfig,
    private formService: FormService,
  ) {}

  ngOnInit(): void {
    const { idSubscription, iframe } = this.config.data
    this.idSubscription = idSubscription;
    if (!this.idSubscription) return this.ref.close();
    this.subSocket(this.idSubscription);
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(iframe);
  }
  
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  subSocket(id: string): void {
    this.formService.listenFormSubscription(id)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(
      (formSubscription) => {
        if (!formSubscription.opened) {
          this.ref.close(formSubscription.doc);
        }
      }
    );
  }

  async close() {
    this.ref.close();
  }
}
