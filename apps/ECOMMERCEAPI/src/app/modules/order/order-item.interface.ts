import { IProduct } from "../product/product.interface";
import { IOrderDetails } from "./order-details.interface";

export interface IOrderItem {
  orderDetails: number | IOrderDetails; // Reference to OrderDetails
  product: number | IProduct; // Reference to Product
  quantity: number;
  price: number;
  discountPrice?: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}