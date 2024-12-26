import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IBrand } from "./brand-data.interface";

export interface IBrandStoreState {
  data: IResponsePayload<IBrand[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IBrand | null,

  loading: boolean,
}
