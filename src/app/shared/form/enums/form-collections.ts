export enum FormCollections {
  Announcements = "announcements",
  Entrepreneurs = "entrepreneurs",
  Resources = "resources",
  Survey = "survey"
}

export const formCollectionNames: Record<FormCollections, string> = {
  [FormCollections.Entrepreneurs]: "Emprendedores",
  [FormCollections.Resources]: "Recursos",
  [FormCollections.Announcements]: "Convocatorias",
  [FormCollections.Survey]: "Encuestas"
}

export const formCollections: { name: string, type: FormCollections }[] = [
  { name: 'Emprendedor', type: FormCollections.Entrepreneurs },
  { name: 'Recurso', type: FormCollections.Resources },
  { name: 'Convocatoria', type: FormCollections.Announcements },
  { name: 'Encuesta', type: FormCollections.Survey },
];