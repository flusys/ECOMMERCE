export interface IBanner {
  id?: number;
  type:string,
  url:string,
  title?: string;
  subTitle:string;
  image?: string;
  serial?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
