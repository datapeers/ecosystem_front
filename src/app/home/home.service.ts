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
    let rolOptions: (keyof typeof options)[] = ['header-admin', 'init'];
    if (user.allowed(Permission.announcements_view))
      rolOptions.push('announcements');
    if (user.allowed(Permission.phases_batch_access)) rolOptions.push('phases');
    if (user.allowed(Permission.community_view)) rolOptions.push('communities');
    if (user.allowed(Permission.view_entrepreneurs))
      rolOptions.push('entrepreneurs');

    if (user.allowed(Permission.view_business)) rolOptions.push('businesses');
    if (user.allowed(Permission.view_startups)) rolOptions.push('startUps');
    if (user.allowed(Permission.view_experts)) rolOptions.push('expert');
    rolOptions.push('public-nodes');
    if (user.allowed(Permission.help_desk_view)) rolOptions.push('helpDesk');
    if (user.allowed(Permission.sites_and_services_view))
      rolOptions.push('siteAndServices');
    if (user.isUser) rolOptions.push('contents');
    if (user.isUser) rolOptions.push('toolkit');
    rolOptions.push('agenda');
    if (user.allowed(Permission.reports_view)) rolOptions.push('reports');
    if (adminOptions.includes(user.rolType as ValidRoles))
      rolOptions.push('settings');
    if (user.allowed(Permission.form_view)) rolOptions.push('forms');

    const outputOptions: IMenuOption[] = rolOptions.map(
      (optKey) => options[optKey] as IMenuOption
    );

    return { options: outputOptions };
  }

  optionsMenu(): Record<string, IMenuOption> {
    return {
      'header-admin': {
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
        label: 'Inicio',
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
        icon: 'album',
      },
      phases: {
        label: 'Fases',
        rute: '/home/phases',
        type: 'single',
        icon: 'box-multiple',
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
        icon: 'users-group',
        children: [
          {
            label: 'Emprendedores',
            rute: '/home/entrepreneurs',
            type: 'single',
            icon: 'users-group',
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
        icon: 'rocket',
        children: [
          {
            label: 'StartUps',
            rute: '/home/startups',
            type: 'single',
            icon: 'rocket',
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
        icon: 'wave-square',
      },
      settings: {
        label: 'Ajustes',
        rute: '/home/personalizar',
        type: 'dropdown',
        class: 'mt-4',
        icon: 'settings',
      },
      forms: {
        label: 'Formularios',
        rute: '/home/forms',
        type: 'single',
        class: 'mt-4',
        icon: 'book',
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
