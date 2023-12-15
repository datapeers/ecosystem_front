import { Component } from '@angular/core';
import {
  faAddressCard,
  faEnvelope,
  faUsers,
  faLink,
  faMap,
  faPersonDotsFromLine,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  faUsers = faUsers;
  faEnvelope = faEnvelope;
  faAddressCard = faAddressCard;
  faLink = faLink;
  faMap = faMap;
  faPersonDotsFromLine = faPersonDotsFromLine;
}
