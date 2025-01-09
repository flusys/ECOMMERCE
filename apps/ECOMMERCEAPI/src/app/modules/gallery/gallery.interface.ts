import { IFolder } from "./folder.interface";

export interface IGallery {
  id?: number;
  name?: string;
  url:string;
  folder?: IFolder | number;
  size?: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
