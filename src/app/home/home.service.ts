import { Injectable } from '@angular/core';
import { IMenu, IMenuOption } from '@shared/models/menu';
import { User } from '@auth/models/user';
import { ValidRoles } from '@auth/models/valid-roles.enum';
import { Permission } from '@auth/models/permissions.enum';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor() {}

  async getDefaultHomeMenu(user: User): Promise<IMenu> {
    const options = this.optionsMenu();
    const adminOptions = [ValidRoles.superAdmin, ValidRoles.admin];

    let menuItems: (keyof typeof options)[] = ['init'];
    menuItems.unshift(user.isUser ? 'header-user' : 'header-admin');
    if (user.allowed(Permission.announcements_view))
      menuItems.push('announcements');
    if (user.allowed(Permission.phases_batch_access)) menuItems.push('phases');

    if (user.allowed(Permission.view_entrepreneurs))
      menuItems.push('entrepreneurs');

    if (user.allowed(Permission.view_business)) menuItems.push('businesses');
    if (user.allowed(Permission.view_startups)) menuItems.push('startUps');
    if (user.allowed(Permission.view_experts)) menuItems.push('expert');
    if (user.isUser) menuItems.push('route');
    if (user.isUser) menuItems.push('contents');
    if (user.isUser) menuItems.push('toolkit');
    if (user.isUser) menuItems.push('startUp');
    menuItems.push('agenda');
    menuItems.push('public-nodes');
    if (!user.isExpert) menuItems.push('helpDesk');
    if (user.isUser || user.allowed(Permission.community_view))
      menuItems.push('communities');
    if (user.allowed(Permission.sites_and_services_view))
      menuItems.push('siteAndServices');

    if (user.allowed(Permission.reports_view)) menuItems.push('reports');
    if (adminOptions.includes(user.rolType as ValidRoles)) {
      menuItems.push('settings');
      menuItems.push('adminPanel');
    }
    // if (user.allowed(Permission.form_view)) menuItems.push('forms');

    const outputOptions: IMenuOption[] = menuItems.map(
      (optKey) => options[optKey] as IMenuOption
    );

    return { options: outputOptions };
  }

  optionsMenu(): Record<string, IMenuOption> {
    return {
      'header-admin': {
        type: 'section',
        label: 'Gestión',
        rute: '',
        icon: '',
      },
      'header-user': {
        type: 'section',
        label: 'Ruta startup',
        rute: '',
        icon: '',
      },
      'public-nodes': {
        type: 'section',
        label: 'Nodos Públicos',
        rute: '',
        icon: '',
      },
      init: {
        label: 'Dashboard',
        rute: '/home/inicio',
        type: 'single',
        icon: 'smart-home',
      },
      route: {
        label: 'Ruta',
        rute: '/home/route',
        type: 'single',
        icon: 'stairs-up',
      },
      contents: {
        label: 'Contenidos',
        rute: '/home/contents',
        type: 'single',
        icon: 'layout-board-split',
      },
      toolkit: {
        label: 'Toolkit',
        icon: 'tools',
        rute: '/home/toolkit',
        type: 'single',
      },
      startUp: {
        label: 'StartUp',
        icon: 'rocket',
        rute: '/home/startup',
        queryParamsRute: {},
        type: 'single',
      },
      agenda: {
        label: 'Agenda',
        icon: 'calendar-event',
        rute: '/home/calendar',
        queryParamsRute: {},
        type: 'single',
      },
      evaluations: {
        label: 'Evalúanos',
        icon: 'clipboard-check',
        rute: '/home/evaluations',
        queryParamsRute: {},
        type: 'single',
      },
      events: {
        label: 'Eventos',
        icon: 'calendar-time',
        rute: '/home/events',
        queryParamsRute: {},
        type: 'single',
      },
      announcements: {
        label: 'Convocatorias',
        rute: '/home/announcements',
        type: 'single',
        // class: 'mt-4',
        icon: 'brand-ubuntu',
      },
      phases: {
        label: 'Fases',
        rute: '/home/phases',
        type: 'single',
        icon: 'stairs',
      },
      communities: {
        label: 'Comunidades',
        rute: '/home/communities',
        type: 'single',
        class: '',
        icon: 'social',
      },
      entrepreneurs: {
        label: 'Emprendedores',
        type: 'dropdown',
        class: 'mt-4',
        icon: 'flag-3',
        children: [
          {
            label: 'Emprendedores',
            rute: '/home/entrepreneurs',
            type: 'single',
            icon: 'flag-3',
          },
          {
            label: 'Prospectos',
            rute: '/home/entrepreneursProspects',
            type: 'single',
            icon: 'list-search',
            queryParamsRute: { prospects: true },
          },
        ],
      },
      businesses: {
        label: 'Empresas',
        rute: '/home/businesses',
        type: 'single',
        icon: 'building-community',
      },
      startUps: {
        label: 'StartUps',
        type: 'dropdown',
        icon: 'seeding',
        children: [
          {
            label: 'StartUps',
            rute: '/home/startups',
            type: 'single',
            icon: 'seeding',
          },
          {
            label: 'Prospectos',
            rute: '/home/startupsProspects',
            type: 'single',
            icon: 'list-search',
            queryParamsRute: { prospects: true },
          },
        ],
      },
      expert: {
        label: 'Expertos',
        type: 'dropdown',
        icon: 'school',
        children: [
          {
            label: 'Expertos',
            rute: '/home/experts',
            type: 'single',
            icon: 'school',
          },
          {
            label: 'Prospectos',
            rute: '/home/expertsProspects',
            type: 'single',
            icon: 'list-search',
            queryParamsRute: { prospects: true },
          },
        ],
      },
      prospects: {
        label: 'Prospectos',
        type: 'dropdown',
        icon: 'input-search',
        children: [
          {
            label: 'Emprendedores',
            rute: '/home/prospectos',
            type: 'single',
            icon: 'users-group',
            queryParamsRute: { type: 'entrepreneur' },
          },
          {
            label: 'StartUps',
            rute: '/home/prospectos',
            type: 'single',
            icon: 'rocket',
            queryParamsRute: { type: 'startup' },
          },
        ],
      },
      helpDesk: {
        label: 'Mesa de ayuda',
        rute: '/home/helpdesk',
        type: 'single',
        class: 'mt-4',
        icon: 'heart-handshake',
      },
      siteAndServices: {
        label: 'Sedes y servicios',
        rute: '/home/site_management',
        type: 'single',
        icon: 'map-search',
      },
      reports: {
        label: 'Reportes',
        rute: '/home/reportes',
        type: 'single',
        icon: 'chart-pie',
      },
      settings: {
        label: 'Ajustes',
        rute: '/home/settings',
        type: 'single',
        icon: 'settings',
      },
      forms: {
        label: 'Formularios',
        rute: '/home/forms',
        type: 'single',
        class: 'mt-4',
        icon: 'forms',
      },
      adminPanel: {
        label: 'Admin panel',
        rute: '/home/admin',
        type: 'single',
        class: 'mt-4',
        icon: 'solar-panel',
      },
      services: {
        label: 'Servicios',
        icon: 'file-star',
        rute: '/home/services',
        queryParamsRute: {},
        type: 'single',
      },
    };
  }
}
