import { IResponsePayload, IFilter, ISort, IPagination } from "flusysng/shared/interfaces";
import { IProduct } from "./product-data.interface";

export interface IProductStoreState {
  data: IResponsePayload<IProduct[]>,

  filter: IFilter | null,
  sort: ISort | null,
  pagination: IPagination,


  editModelData: IProduct | null,

  loading: boolean,
}
