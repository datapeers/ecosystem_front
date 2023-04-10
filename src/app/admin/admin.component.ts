import { Component } from '@angular/core';
import { faAddressCard, faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  faUsers = faUsers;
  faEnvelope = faEnvelope;
  faAddressCard = faAddressCard;
}
