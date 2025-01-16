import { IResponsePayload, IFilter, ISort, IPagination } from "flusysng/shared/interfaces";
import { IGallery } from "./gallery-data.interface";

export interface IGalleryStoreState {
  data: IResponsePayload<IGallery[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],
  pagination:IPagination,

  loading: boolean,
}
