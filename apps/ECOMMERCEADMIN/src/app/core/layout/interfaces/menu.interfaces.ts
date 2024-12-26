
export interface IMenu {
  name: string;
  icon: string;
  routerLink?: Array<string>;
  items?: Array<IMenu>
}
