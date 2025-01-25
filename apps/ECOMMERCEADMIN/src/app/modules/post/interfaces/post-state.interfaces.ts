import { IResponsePayload, IFilter, ISort, IPagination } from "flusysng/shared/interfaces";
import { IPost } from "./post-data.interface";

export interface IPostStoreState {
  data: IResponsePayload<IPost[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],
  pagination: IPagination,

  editModelData: IPost | null,

  loading: boolean,
}
