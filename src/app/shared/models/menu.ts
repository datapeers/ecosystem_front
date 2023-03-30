export interface IMenu {
  header?: IMenuHeader;
  returnPath?: string[];
  returnQueryParamsRute?: any;
  options: IMenuOption[];
}

export interface IMenuHeader {
  avatar?: string;
  title?: string;
  subTitle?: string;
}
export interface IMenuOption {
  label: string;
  command?: () => void;
  //Undefined and null routes are ignored by router link
  rute?: any;
  queryParamsRute?: any;
  type: 'single' | 'dropdown' | 'section';
  icon?: any;
  opened?: boolean;
  class?: string;
  children?: IMenuOption[];
  metadata?: any;
  tag?: string;
}
