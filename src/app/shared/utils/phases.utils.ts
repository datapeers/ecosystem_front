import { Phase } from '@home/phases/model/phase.model';

export function getPhaseAndNumb(cadena: string): [string, string] {
  try {
    // Modificamos el regex para que sea más flexible
    const regex = /fase (\d+)|fase (\d+):|\bFase (\d+)/i;
    const matches = cadena.match(regex);
    if (matches) {
      const numero = matches[1] || matches[2] || matches[3] || '0';
      const fase = numero !== '0' ? 'Fase' : '';
      return [fase, numero];
    } else {
      return ['', '0']; // No se encontró una coincidencia, devolvemos Fase 0
    }
  } catch (error) {
    console.log(error);
    return ['', ''];
  }
}

export function getNameBase(phase: Phase): string {
  const stringDivided = phase.name.indexOf(': ');
  if (stringDivided !== -1) {
    return phase.name.substring(stringDivided + 2); // Sumamos 2 para omitir los dos puntos y el espacio.
  }
  return phase.name; // Si no se encuentra ':' en la cadena, no hacemos cambios.
}
