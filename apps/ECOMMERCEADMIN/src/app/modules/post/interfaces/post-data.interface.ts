import { ICommonData } from "flusysng/shared/interfaces";
import { IPostCategory } from "./post-category-data.interface";

export interface IPost extends ICommonData {
    id: number;
    title?: string;
    description?: string;
    image?: string;
    category: IPostCategory | number
}
