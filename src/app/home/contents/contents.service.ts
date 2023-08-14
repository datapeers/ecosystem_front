import { Injectable } from '@angular/core';
import { User } from '@auth/models/user';
import { Content } from '@home/phases/model/content.model';
import { Phase } from '@home/phases/model/phase.model';
import {
  faCalendar,
  faClipboard,
  faList,
  faCamera,
  faUsers,
  faPenRuler,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class ContentsService {
  constructor() {}

  optionsMenu(sprint: Content, user: User) {
    let menu = {
      returnPath: ['home', 'inicio'],
      options: [],
    };
    for (const child of sprint.childs) {
      menu.options.push({
        label: child.name,
        icon: faList,
        rute: ['contents'],
        type: 'single',
        queryParamsRute: { sprint: sprint._id, content: child._id },
      });
    }
    return menu;
  }
}
