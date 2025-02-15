import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IOrderDetails } from "./order-data.interface";

export interface IOrderStoreState {
  data: IResponsePayload<IOrderDetails[]>,

  filter: IFilter | null,

  editModelData: IOrderDetails | null,

  loading: boolean,
}
