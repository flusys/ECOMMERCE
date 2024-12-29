import { ICommonData } from "flusysng/shared/interfaces";

export interface ICategory extends ICommonData {
    name: string;
    parent?: ICategory | number;
    image?: string;
    description?: string;

    //UI Helper
    children: Array<ICategory>
}
