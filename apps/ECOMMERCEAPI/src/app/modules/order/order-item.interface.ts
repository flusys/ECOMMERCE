import { IProduct } from "../product/product.interface";

export interface IOrderItem {
  product: number | IProduct; // Reference to Product
  quantity: number;
  price: number;
  discountPrice?: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}