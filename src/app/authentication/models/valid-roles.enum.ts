export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
  expert = 'expert',
  // investor = 'investor',
  host = 'host',
  teamCoach = 'teamCoach',
}

export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: 'Super admin',
  [ValidRoles.admin]: 'Admin',
  [ValidRoles.user]: 'Usuario',
  [ValidRoles.expert]: 'Experto',
  // [ValidRoles.investor]: "Inversionista",
  [ValidRoles.host]: 'Host',
  [ValidRoles.teamCoach]: 'Team Coach',
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
