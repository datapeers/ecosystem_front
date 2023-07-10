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
  faRocket,
  faSeedling,
  faSync,
  faUser,
  faUserTie,
  faUsers,
  faVolumeHigh,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { User } from '@auth/models/user';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor() {}

  async getDefaultHomeMenu(user: User): Promise<IMenu> {
    const options = this.optionsMenu();
    let rolOptions: (keyof typeof options)[] = [];
    switch (user.rol.type) {
      case 'superAdmin':
        rolOptions = [
          'init',
          'announcements',
          'phases',
          'communities',
          'entrepreneurs',
          'businesses',
          'startUps',
          'expert',
          'investors',
          'helpDesk',
          'foros',
          'reports',
          'settings',
          'forms',
          // 'inversionistas',
        ];
        break;
      case 'admin':
        rolOptions = [
          'init',
          'announcements',
          'phases',
          'communities',
          'entrepreneurs',
          'businesses',
          'startUps',
          'expert',
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
      // case 'investor':
      //   rolOptions = ['init', 'startUps'];
      //   break;
      default:
        break;
    }
    const outputOptions: IMenuOption[] = rolOptions.map(
      (optKey) => options[optKey] as IMenuOption
    );
    return { options: outputOptions };
  }

  optionsMenu() {
    return {
      init: {
        label: 'Inicio',
        rute: '/home/inicio',
        type: 'single',
        icon: faHouse,
      },
      home: {
        label: 'Home',
        icon: faHome,
        rute: '/home/home',
        queryParamsRute: {},
        type: 'single',
      },
      route: {
        label: 'Ruta',
        rute: '/home/route',
        type: 'single',
        icon: faRoad,
      },
      toolkit: {
        label: 'Toolkit',
        icon: faFolderOpen,
        rute: '/home/toolkit',
        queryParamsRute: { sprint: '3' },
        type: 'single',
      },
      startUp: {
        label: 'StartUp',
        icon: faSeedling,
        rute: '/home/startup',
        queryParamsRute: {},
        type: 'single',
      },
      agenda: {
        label: 'Agenda',
        icon: faCalendar,
        rute: '/home/agenda',
        queryParamsRute: {},
        type: 'single',
      },
      evaluations: {
        label: 'Evalúanos',
        icon: faFileText,
        rute: '/home/evaluations',
        queryParamsRute: {},
        type: 'single',
      },
      events: {
        label: 'Eventos',
        icon: faCalendarDays,
        rute: '/home/events',
        queryParamsRute: {},
        type: 'single',
      },
      announcements: {
        label: 'Convocatorias',
        rute: '/home/announcements',
        type: 'single',
        // class: 'mt-4',
        icon: faVolumeHigh,
      },
      phases: {
        label: 'Fases',
        rute: '/home/phases',
        type: 'single',
        icon: faSync,
      },
      communities: {
        label: 'Comunidades',
        rute: '/home/communities',
        type: 'single',
        class: '',
        icon: faUsers,
      },
      entrepreneurs: {
        label: 'Emprendedores',
        rute: '/home/entrepreneurs',
        type: 'single',
        class: 'mt-4',
        icon: faUser,
      },
      businesses: {
        label: 'Empresas',
        rute: '/home/businesses',
        type: 'single',
        icon: faBuilding,
      },
      startUps: {
        label: 'StartUps',
        rute: '/home/startups',
        type: 'single',
        icon: faRocket,
      },
      expert: {
        label: 'Expertos',
        rute: '/home/experts',
        type: 'single',
        icon: faUsers,
      },
      investors: {
        label: 'Inversionistas',
        rute: '/home/investors',
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
            rute: '/home/prospectos',
            type: 'single',
            icon: faUser,
            queryParamsRute: { type: 'entrepreneur' },
          },
          {
            label: 'StartUps',
            rute: '/home/prospectos',
            type: 'single',
            icon: faBuilding,
            queryParamsRute: { type: 'startup' },
          },
        ],
      },
      helpDesk: {
        label: 'Mesa de ayuda',
        rute: '/home/helpdesk',
        type: 'single',
        class: 'mt-4',
        icon: faCircleQuestion,
      },
      foros: {
        label: 'Administración de sedes',
        rute: '/home/site_management',
        type: 'single',
        icon: faComments,
      },
      reports: {
        label: 'Reportes',
        rute: '/home/reportes',
        type: 'single',
        icon: faWaveSquare,
      },
      settings: {
        label: 'Ajustes',
        rute: '/home/personalizar',
        type: 'dropdown',
        class: 'mt-4',
        icon: faCog,
      },
      forms: {
        label: 'Formularios',
        rute: '/home/forms',
        type: 'single',
        class: 'mt-4',
        icon: faBook,
      },
      services: {
        label: 'Servicios',
        icon: faHandshake,
        rute: '/home/services',
        queryParamsRute: {},
        type: 'single',
      },
    };
  }
}
