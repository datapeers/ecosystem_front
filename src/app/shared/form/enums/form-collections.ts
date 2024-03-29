export enum FormCollections {
  announcements = 'announcements',
  resources = 'resources',
  survey = 'survey',
  entrepreneurs = 'entrepreneurs',
  startups = 'startups',
  experts = 'experts',
  businesses = 'businesses',
  evaluations = 'evaluations',
}

export const formCollectionNames: Record<FormCollections, string> = {
  [FormCollections.announcements]: 'Convocatorias',
  [FormCollections.resources]: 'Recursos',
  [FormCollections.survey]: 'Encuestas',
  [FormCollections.entrepreneurs]: 'Emprendedores',
  [FormCollections.startups]: 'Startups',
  [FormCollections.experts]: 'Expertos',
  [FormCollections.businesses]: 'Empresas',
  [FormCollections.evaluations]: 'Evaluaciones',
};

export const formCollections = Object.entries(formCollectionNames).map(
  ([key, value]: [FormCollections, string]) => {
    return { name: value, type: key };
  }
);
