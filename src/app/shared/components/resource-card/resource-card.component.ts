import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
})
export class ResourceCardComponent {
  @Input('date') date = '';
  @Input('title') title = '';
  @Input('detail') detail = '';
  @Input('approvedBy') approvedBy = '';
  @Input('state') state = '';
}
