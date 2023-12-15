import { Component, OnInit } from '@angular/core';
import { configTinyMce } from '@shared/models/configTinyMce';
import { TermsOfUse } from '@shared/services/termsOfUse/terms-of-use.model';
import { TermsOfUseService } from '@shared/services/termsOfUse/terms-of-use.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent implements OnInit {
  termsExperts: TermsOfUse;
  loaded = false;
  configTiny = configTinyMce;
  constructor(
    private service: TermsOfUseService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getTerms();
  }

  async getTerms() {
    this.loaded = false;
    this.service
      .getTermsOfUse('experts')
      .then((ans) => {
        this.termsExperts = ans;
        this.loaded = true;
      })
      .catch((err) => {
        console.warn(err);
        this.loaded = true;
      });
  }

  saveChanges() {
    this.loaded = false;
    this.service
      .updateTermsOfUse({
        _id: this.termsExperts._id,
        content: this.termsExperts.content,
        extra_options: {},
      })
      .then((ans) => {
        this.toast.success({ summary: 'Cambios guardados', detail: '' });
        this.loaded = true;
      })
      .catch((err) => {
        console.warn(err);
        this.toast.error({ summary: 'Error al guardar cambios', detail: err });
        this.loaded = true;
      });
  }
}
