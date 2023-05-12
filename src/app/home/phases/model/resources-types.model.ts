export enum ResourcesTypes {
  downloadable = 'downloadable',
  task = 'task',
  form = 'form',
}

export const resourcesTypesNames: Record<ResourcesTypes, string> = {
  [ResourcesTypes.downloadable]: 'Descargable',
  [ResourcesTypes.task]: 'Entregable',
  [ResourcesTypes.form]: 'Formulario',
};

export const resourcesTypesArray: { label: string; value: ResourcesTypes }[] =
  Object.entries(resourcesTypesNames).map(([value, label]) => ({
    label,
    value: value as ResourcesTypes,
  }));
