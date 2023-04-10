export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
  responsible = 'responsible',
  investor = 'investor',
}


export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: "Super admin",
  [ValidRoles.admin]: "Admin",
  [ValidRoles.user]: "Usuario",
  [ValidRoles.responsible]: "Responsable",
  [ValidRoles.investor]: "Inversionista"
}

export const validRolName = (rol: ValidRoles) => {
  return rolNames[rol];
};

export const validRoles = Object.entries(rolNames).map(([key, value]) => {
  return {
    name: value,
    value: key as ValidRoles,
  }
});