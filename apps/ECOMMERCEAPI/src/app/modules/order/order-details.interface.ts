export interface IOrderDetails {
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
}