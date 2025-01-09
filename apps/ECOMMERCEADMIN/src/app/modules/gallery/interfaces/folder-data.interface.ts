import { ICommonData } from "flusysng/shared/interfaces";

export interface IFolder extends ICommonData {
    id: number;
    name?: string;
    serial?: number;
  }
