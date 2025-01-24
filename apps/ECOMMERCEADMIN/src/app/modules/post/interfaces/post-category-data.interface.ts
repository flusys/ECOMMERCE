import { ICommonData } from "flusysng/shared/interfaces";

export interface IPostCategory extends ICommonData {
  id: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
