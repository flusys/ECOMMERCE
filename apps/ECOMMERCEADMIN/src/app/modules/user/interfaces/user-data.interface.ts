import { ICommonData } from "flusysng/shared/interfaces";

export interface IUser extends ICommonData {
    id: number;
    firstname?: string;
    lastname?: string;
    address?: string;
    email?: string;
    phone?: string;
  }
  