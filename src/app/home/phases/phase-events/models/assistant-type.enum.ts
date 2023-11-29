export enum attendanceType {
  onsite = 'onsite',
  virtual = 'virtual',
  zoom = 'zoom',
}

export const attendanceTypeLabels: Record<attendanceType, string> = {
  [attendanceType.onsite]: 'Presencial',
  [attendanceType.virtual]: 'Virtual',
  [attendanceType.zoom]: 'Zoom',
};

export const stateOptionsAssistant = Object.entries(attendanceTypeLabels).map(
  ([key, value]) => {
    return {
      label: value,
      value: key as attendanceType,
    };
  }
);
