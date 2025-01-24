import { ICommonData } from "flusysng/shared/interfaces";

export interface IBanner extends ICommonData {
  type:string,
  url:string,
  title?: string;
  subTitle:string;
  image?: string;
  mblImage?: string;
  serial?: number;
}