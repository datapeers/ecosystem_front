export enum FormCollections {
  announcements = "announcements",
  resources = "resources",
  survey = "survey",
  entrepreneurs = "entrepreneurs",
  startups = "startups",
  investors = "investors",
  experts = "experts",
  businesses = "businesses",
}

export const formCollectionNames: Record<FormCollections, string> = {
  [FormCollections.announcements]: "Convocatorias",
  [FormCollections.resources]: "Recursos",
  [FormCollections.survey]: "Encuestas",
  [FormCollections.entrepreneurs]: "Emprendedores",
  [FormCollections.startups]: "Startups",
  [FormCollections.investors]: "Inversionistas",
  [FormCollections.experts]: "Expertos",
  [FormCollections.businesses]: "Empresas",
}

export const formCollections = Object.entries(formCollectionNames).map(([key, value]: [FormCollections, string]) => {
  return { name: value, type: key };
});