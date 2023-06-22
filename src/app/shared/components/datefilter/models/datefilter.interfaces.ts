export interface ListedObject {
  objectRef: any;
  date: Date;
  name: string;
  duration?: number;
  durationString?: string;
  state?: datedFlagMap;
}

export interface datedDataStorage<> {
  all: ListedObject[];
  past?: ListedObject[];
  future?: ListedObject[];
  current?: ListedObject[];
  daily?: ListedObject[];
  between?: ListedObject[];
}

export interface datedFlagMap {
  isOld?: boolean;
  willCome?: boolean;
  isCurrent?: boolean;
  inRange?: boolean;
  daily?: boolean;
}

export interface LabelValueConfig {
  label: string;
  value: string;
}
