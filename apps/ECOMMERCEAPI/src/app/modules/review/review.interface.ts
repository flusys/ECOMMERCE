export interface IReview {
  id?: number;
  star:number,
  name:string,
  email?: string;
  review:string;
  createdAt?: Date;
  updatedAt?: Date;
}
