import { IPostCategory } from "./post-category.interface";

export interface IPost {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  category: IPostCategory | number
  createdAt?: Date;
  updatedAt?: Date;
}
