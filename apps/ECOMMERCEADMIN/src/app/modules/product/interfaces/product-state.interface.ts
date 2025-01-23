import { IResponsePayload, IFilter, ISort, IPagination } from "flusysng/shared/interfaces";
import { IParentProduct, IProduct } from "./product-data.interface";

export interface IProductStoreState {
  data: IResponsePayload<IProduct[]>,

  filter: IFilter | null,
  sort: ISort | null,
  pagination: IPagination,


  editModelData: IProduct | null,
  editModelParentData: IParentProduct | null,

  loading: boolean,
}
