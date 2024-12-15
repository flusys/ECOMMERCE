import { IAttributeValue } from "../attribute/attribute-value.interface";
import { IParentProduct } from "./parent-product.interface";

export interface IProduct {
  _id?: string;
  readOnly: boolean;
  image: string;
  warning: string;
  warningDay: number;
  taxType: number;
  taxAmount: number;
  refundable: boolean;
  returnable: boolean;
  price: number;
  sku: string;
  barCode: string;
  orderLimit: number;
  ingredients: { name: string; value: string }[];
  trackQuantity: number;
  earnPoint: number;
  parentProduct: IParentProduct;
  variants: IAttributeValue[];
  status: string;
  isActive: boolean;
  activeOnline: boolean;
}
