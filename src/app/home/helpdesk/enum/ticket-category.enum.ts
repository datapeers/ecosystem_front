export enum TicketCategory {
  support = 'support',
  specializedConsulting = 'specializedConsulting',
  mentoring = 'mentoring',
  recommendation = 'recommendation',
  ctei = 'ctei',
}

export const ticketCategoryNames: Record<TicketCategory, string> = {
  [TicketCategory.support]: 'Soporte',
  [TicketCategory.specializedConsulting]: 'Asesoría especializada',
  [TicketCategory.mentoring]: 'Mentoría',
  [TicketCategory.recommendation]: 'Recomendación',
  [TicketCategory.ctei]: 'Necesidad CTei (Ciencia, Tecnología e Innovación)',
};

export const ticketCategoryColors: Record<TicketCategory, string> = {
  [TicketCategory.support]: '#fff1dc',
  [TicketCategory.specializedConsulting]: '#db5f39',
  [TicketCategory.mentoring]: '#4552a7',
  [TicketCategory.recommendation]: '#dbffff',
  [TicketCategory.ctei]: '#b8c53a',
};

export const ticketCategoryObj = Object.entries(ticketCategoryNames).map(
  ([key, value]) => {
    return {
      name: value,
      value: key as TicketCategory,
      color: ticketCategoryColors[key],
    };
  }
);
