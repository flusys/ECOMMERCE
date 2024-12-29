import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { ICategory } from "./category-data.interface";

export interface ICategoryStoreState {
  data: IResponsePayload<ICategory[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: ICategory | null,

  loading: boolean,
}
