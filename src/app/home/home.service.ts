import { Injectable } from '@angular/core';
import {
  faBook,
  faBuilding,
  faCalendar,
  faCalendarDays,
  faCircleQuestion,
  faCog,
  faComments,
  faFileText,
  faFolderOpen,
  faHandshake,
  faHome,
  faHouse,
  faMagnifyingGlass,
  faRoad,
  faSeedling,
  faSync,
  faUser,
  faUserTie,
  faUsers,
  faVolumeHigh,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { IMenuOption } from '@shared/models/menu';
import { User } from '@shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor() {}

  async getDefaultHomeMenu(user: User): Promise<IMenuOption[]> {
    const options = this.optionsMenu();
    let rolOptions: (keyof typeof options)[] = [];
    switch (user.rol) {
      case 'admin':
        rolOptions = [
          'init',
          'announcements',
          'phases',
          'communities',
          'entrepreneurs',
          'startUps',
          'responsible',
          'investors',
          'helpDesk',
          'foros',
          'reports',
          'settings',
          'forms',
          // 'inversionistas',
        ];
        break;
      case 'user':
        rolOptions = [
          'home',
          'route',
          'toolkit',
          // 'communities',
          'startUp',
          'agenda',
          'evaluations',
          'events',
          'helpDesk',
          'communities',
          'foros',
          'services',
        ];
        break;
      case 'investor':
        rolOptions = ['init', 'startUps'];
        break;
      default:
        break;
    }
    const outputOptions: IMenuOption[] = rolOptions.map(
      (optKey) => options[optKey] as IMenuOption
    );
    return outputOptions;
  }

  optionsMenu() {
    return {
      init: {
        label: 'Inicio',
        rute: '/inicio',
        type: 'single',
        icon: faHouse,
      },
      home: {
        label: 'Home',
        icon: faHome,
        rute: '/home',
        queryParamsRute: {},
        type: 'single',
      },
      route: {
        label: 'Ruta',
        rute: '/route',
        type: 'single',
        icon: faRoad,
      },
      toolkit: {
        label: 'Toolkit',
        icon: faFolderOpen,
        rute: '/toolkit',
        queryParamsRute: { sprint: '3' },
        type: 'single',
      },
      startUp: {
        label: 'StartUp',
        icon: faSeedling,
        rute: '/startup',
        queryParamsRute: {},
        type: 'single',
      },
      agenda: {
        label: 'Agenda',
        icon: faCalendar,
        rute: '/agenda',
        queryParamsRute: {},
        type: 'single',
      },
      evaluations: {
        label: 'Evalúanos',
        icon: faFileText,
        rute: '/evaluations',
        queryParamsRute: {},
        type: 'single',
      },
      events: {
        label: 'Eventos',
        icon: faCalendarDays,
        rute: '/events',
        queryParamsRute: {},
        type: 'single',
      },
      announcements: {
        label: 'Convocatorias',
        rute: '/announcements',
        type: 'single',
        // class: 'mt-4',
        icon: faVolumeHigh,
      },
      phases: {
        label: 'Fases',
        rute: '/phases',
        type: 'single',
        icon: faSync,
      },
      communities: {
        label: 'Comunidades',
        rute: 'communities',
        type: 'single',
        class: '',
        icon: faUsers,
      },
      entrepreneurs: {
        label: 'Emprendedores',
        rute: '/entrepreneurs',
        type: 'single',
        class: 'mt-4',
        icon: faUser,
      },
      startUps: {
        label: 'StartUps',
        rute: '/startups',
        type: 'single',
        icon: faBuilding,
      },
      responsible: {
        label: 'Responsables',
        rute: '/responsables',
        type: 'single',
        icon: faUsers,
      },
      investors: {
        label: 'Inversionistas',
        rute: '/investors',
        type: 'single',
        icon: faUserTie,
      },
      prospects: {
        label: 'Prospectos',
        type: 'dropdown',
        icon: faMagnifyingGlass,
        children: [
          {
            label: 'Emprendedores',
            rute: '/prospectos',
            type: 'single',
            icon: faUser,
            queryParamsRute: { type: 'entrepreneur' },
          },
          {
            label: 'StartUps',
            rute: '/prospectos',
            type: 'single',
            icon: faBuilding,
            queryParamsRute: { type: 'startup' },
          },
        ],
      },
      helpDesk: {
        label: 'Mesa de ayuda',
        rute: '/helpdesk',
        type: 'single',
        class: 'mt-4',
        icon: faCircleQuestion,
      },
      foros: {
        label: 'Foros',
        rute: '/foros',
        type: 'single',
        icon: faComments,
      },
      reports: {
        label: 'Reportes',
        rute: '/reportes',
        type: 'single',
        icon: faWaveSquare,
      },
      settings: {
        label: 'Ajustes',
        rute: '/personalizar',
        type: 'dropdown',
        class: 'mt-4',
        icon: faCog,
      },
      forms: {
        label: 'Formularios',
        rute: '/forms',
        type: 'single',
        class: 'mt-4',
        icon: faBook,
      },
      services: {
        label: 'Servicios',
        icon: faHandshake,
        rute: '/services',
        queryParamsRute: {},
        type: 'single',
      },
    };
  }
}
