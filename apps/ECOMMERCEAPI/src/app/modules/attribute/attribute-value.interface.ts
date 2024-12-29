import { IAttribute } from "./attribute.interface";

export interface IAttributeValue {
  id: number;
  name?: string;
  attribute: IAttribute | Number,
  createdAt?: Date;
  updatedAt?: Date;
}
