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
