import { ShepherdService } from 'angular-shepherd';

export const appOnboarding: any[] = [
  {
    attachTo: {
      element: '#main-ico',
      on: 'right-end',
    },
    text: 'Usa este ícono para expandir y contraer el menú lateral, tener el menú contraído te dará más espacio en pantalla para trabajar',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          localStorage.setItem('onboarding', 'viewed');
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#side-menu',
      on: 'right',
    },
    text: 'Desde el menú lateral visita las diferentes secciones que la plataforma tiene para ti',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          localStorage.setItem('onboarding', 'viewed');
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Anterior',
        action() {
          this.back();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#top-menu',
      on: 'bottom',
    },
    text: 'Acá encuentras: el botón para expandir y contraer el menú lateral, información de tu fase y avance, el buscador general, la campana para acceder a las notificaciones y tu información de perfil',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          localStorage.setItem('onboarding', 'viewed');
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Anterior',
        action() {
          this.back();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#user-profile',
      on: 'bottom',
    },
    text: 'Haz click acá para acceder a las opciones de usuario, configuración de cuenta y se perfil',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          localStorage.setItem('onboarding', 'viewed');
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Anterior',
        action() {
          this.back();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    text: 'En las diferentes secciones encontrarás un texto de ayuda en la parte superior precedido de un 💡, apóyate en el para entender que puedes hacer allí, si es necesario haz click en 💡 para más información',
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Completar',
        action() {
          localStorage.setItem('onboarding', 'viewed');
          this.complete();
        },
      },
    ],
  },
];

export const routeOnboarding: any[] = [
  {
    attachTo: {
      element: '#info',
      on: 'bottom',
    },
    text: 'Aca encontrarás información general de tu avance',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#route',
      on: 'top',
    },
    text: 'Haz click en las diferentes secciones de la ruta para que conozcas más información de ellas',
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Completar',
        action() {
          this.complete();
        },
      },
    ],
  },
];

export const toolkitOnboarding: any[] = [
  {
    attachTo: {
      element: '#toolkit-filter',
      on: 'bottom',
    },
    text: 'Aca encontrarás filtros para acceder a recursos de sprint y batch`s anteriores recuerda siempre regresar a tu batch y sprint actual',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#resources',
      on: 'top',
    },
    text: 'Encuentra diferentes tarjetas con los diferentes recursos disponibles en cada sprint y batch que participes',
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Completar',
        action() {
          this.complete();
        },
      },
    ],
  },
];

export const startupProfileOnboarding: any[] = [
  {
    attachTo: {
      element: '#avatarChange',
      on: 'bottom',
    },
    text: 'Logo de la startup, cámbialo cuando desees dando click sobre el',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#editInfoStartup',
      on: 'top',
    },
    text: 'Modifica los datos de tu startUp en cualquier momento dando click',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#functionsStartup',
      on: 'top',
    },
    text: 'Modifica las funciones publicas que tienen los miembros de tu startup',
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Completar',
        action() {
          this.complete();
        },
      },
    ],
  },
];

export const calendarOnboarding: any[] = [
  {
    attachTo: {
      element: '#viewerCalendar',
      on: 'bottom',
    },
    text: `Tienes las opciones de ver los eventos dentro del <strong>Calendario</strong> o en un listado en la vista de <strong>Detalles</strong>`,
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#calendarContain',
      on: 'top',
    },
    text: 'Cambia la vistas que tienes del calendario en cualquier momento',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#expertBtn',
      on: 'top',
    },
    text: 'Mira en cualquier momento el listado de los expert asignados a tu startup',
    buttons: [
      {
        text: 'Cancelar',
        action() {
          this.cancel();
        },
      },
      {
        text: 'Regresar',
        action() {
          this.back();
        },
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action() {
          this.next();
        },
      },
    ],
  },
  {
    attachTo: {
      element: '#acompBtn',
      on: 'top',
    },
    text: 'Agenda con nuestro equipo de acompañamiento alguna Mentoría/Asesoría si lo necesitas.',
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Completar',
        action() {
          this.complete();
        },
      },
    ],
  },
];
