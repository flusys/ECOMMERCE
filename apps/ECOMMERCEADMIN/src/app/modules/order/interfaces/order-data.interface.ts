import { ICommonData } from "flusysng/shared/interfaces";
import { IProduct } from "../../product/interfaces/product-data.interface";

export interface IOrderDetails extends ICommonData{
  firstName: string;
  lastName?: string;
  address: string;
  email: string;
  phone: string;
  createAccount?: boolean;
  differentAddress?: boolean;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;

  orderitems:Array<IOrderItem>
}

export interface IOrderItem extends ICommonData{
  orderDetails: number | IOrderDetails; // Reference to OrderDetails
  product: number | IProduct; // Reference to Product
  quantity: number;
  price: number;
  discountPrice?: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}