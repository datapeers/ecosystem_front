export enum RolStartup {
  leader = 'leader',
  partner = 'partner',
}

export const rolStartupNames: Record<RolStartup, string> = {
  [RolStartup.leader]: 'CEO',
  [RolStartup.partner]: 'Colaborador',
};

export const rolStartupObj = Object.entries(rolStartupNames).map(
  ([key, value]) => {
    return {
      name: value,
      value: key as RolStartup,
    };
  }
);
