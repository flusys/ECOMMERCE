export interface ICategory {
  id?: number;
  name?: string;
  parent?: ICategory;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
