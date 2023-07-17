export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
  expert = 'expert',
  // investor = 'investor',
  host = 'host',
  teamCoach = 'teamCoach',
  challenger = 'challenger',
}

export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: 'Super admin',
  [ValidRoles.admin]: 'Admin',
  [ValidRoles.user]: 'Usuario',
  [ValidRoles.challenger]: 'Challenger',
  [ValidRoles.expert]: 'Experto',
  // [ValidRoles.investor]: "Inversionista",
  [ValidRoles.host]: 'Host',
  [ValidRoles.teamCoach]: 'Team Coach',
};

export const rolValues: Record<ValidRoles, number> = {
  [ValidRoles.superAdmin]: 9999,
  [ValidRoles.admin]: 999,
  [ValidRoles.host]: 99,
  [ValidRoles.teamCoach]: 9,
  [ValidRoles.expert]: 3,
  [ValidRoles.user]: 2,
  [ValidRoles.challenger]: 1,
};

export const validRolName = (rol: ValidRoles) => {
  return rolNames[rol];
};

export const validRoles = Object.entries(rolNames).map(([key, value]) => {
  return {
    name: value,
    value: key as ValidRoles,
  };
});
