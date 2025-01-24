import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IBanner } from "./banner-data.interface";

export interface IBannerStoreState {
  data: IResponsePayload<IBanner[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IBanner | null,

  loading: boolean,
}
