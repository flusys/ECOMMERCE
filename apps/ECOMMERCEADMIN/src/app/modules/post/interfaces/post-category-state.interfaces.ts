import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IPostCategory } from "./post-category-data.interface";

export interface IPostCategoryStoreState {
  data: IResponsePayload<IPostCategory[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IPostCategory | null,

  loading: boolean,
}
