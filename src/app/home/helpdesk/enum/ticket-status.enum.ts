export enum TicketStates {
  Open = 'Open',
  InProgress = 'InProgress',
  Closed = 'Closed',
}

export const ticketStatesNames: Record<TicketStates, string> = {
  [TicketStates.Open]: 'Abierto',
  [TicketStates.InProgress]: 'En progreso',
  [TicketStates.Closed]: 'Cerrado',
};

export const ticketStatesColors: Record<TicketStates, string> = {
  [TicketStates.Open]: 'success',
  [TicketStates.InProgress]: 'warning',
  [TicketStates.Closed]: 'danger',
};

export const ticketStatesObj = Object.entries(ticketStatesNames).map(
  ([key, value]) => {
    return {
      name: value,
      value: key as TicketStates,
      color: ticketStatesColors[key],
    };
  }
);
