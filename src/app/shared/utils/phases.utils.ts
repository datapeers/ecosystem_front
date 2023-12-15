import { Phase } from '@home/phases/model/phase.model';

export function getPhaseAndNumb(cadena: string): [string, string] {
  const regex = /Fase (\d+)/;
  const matches = cadena.match(regex);
  if (matches && matches.length === 2) {
    const fase = 'Fase';
    const numero = matches[1];
    return [fase, numero];
  } else {
    return ['Fase', '0']; // No se encontró una coincidencia
  }
}

export function getNameBase(phase: Phase): string {
  const stringDivided = phase.name.indexOf(': ');
  if (stringDivided !== -1) {
    return phase.name.substring(stringDivided + 2); // Sumamos 2 para omitir los dos puntos y el espacio.
  }
  return phase.name; // Si no se encuentra ':' en la cadena, no hacemos cambios.
}
