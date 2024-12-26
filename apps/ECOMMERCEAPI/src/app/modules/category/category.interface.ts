export interface ICategory {
  _id?: string;
  name?: string;
  parent?: ICategory;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
