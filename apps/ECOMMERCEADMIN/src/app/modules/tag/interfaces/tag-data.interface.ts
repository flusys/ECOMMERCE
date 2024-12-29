import { ICommonData } from "flusysng/shared/interfaces";

export interface ITag extends ICommonData {
    id: number;
    name?: string;
    priority?: number;
    image?: string;
  }
  