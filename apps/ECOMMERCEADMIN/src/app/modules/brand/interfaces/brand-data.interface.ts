import { ICommonData } from "flusysng/shared/interfaces";

export interface IBrand extends ICommonData {
  isActive: boolean;
  name: string;
  description?: string;
  image?: string;
  serial?: number;
}