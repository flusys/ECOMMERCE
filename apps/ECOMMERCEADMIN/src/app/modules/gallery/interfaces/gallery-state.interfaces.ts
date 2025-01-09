import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IGallery } from "./gallery-data.interface";

export interface IGalleryStoreState {
  data: IResponsePayload<IGallery[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  loading: boolean,
}
