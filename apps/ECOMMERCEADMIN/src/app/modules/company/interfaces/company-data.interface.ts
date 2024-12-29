import { ICommonData } from "flusysng/shared/interfaces";

export interface ICompany extends ICommonData {
  name: string;
  address?: string;
  image?: string;
}