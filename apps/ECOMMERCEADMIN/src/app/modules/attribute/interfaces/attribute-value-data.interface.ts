import { ICommonData } from "flusysng/shared/interfaces";
import { IAttribute } from "./attribute-data.interface";

export interface IAttributeValue extends ICommonData {
  id: number;
  name?: string;
  attribute: IAttribute | number,
  createdAt?: Date;
  updatedAt?: Date;
}
