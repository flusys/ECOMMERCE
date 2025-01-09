import { ICommonData } from "flusysng/shared/interfaces";
import { IFolder } from "./folder-data.interface";

export interface IGallery extends ICommonData {
    id: number;
    name?: string;
    url:string;
    folder?: IFolder | number;
    size?: string;
    type?: string;
  }
