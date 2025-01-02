import { IAttributeValue } from "../attribute/attribute-value.interface";
import { IParentProduct } from "./parent-product.interface";

export interface IProduct {
  id: number;
  readOnly: boolean;
  image: string;
  warning: string;
  warningDay: number;
  taxType: number;
  taxAmount: number;
  refundable: boolean;
  returnable: boolean;
  sku: string;
  barCode: string;
  price: number;
  orderLimit: number;
  ingredients: { name: string, value: string }[];
  trackQuantity: number;
  earnPoint: number;
  parentInfo: IParentProduct;
  variants: IAttributeValue[];
  variantIds: number[];
  status: string;
  isActive: boolean;
  activeOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
