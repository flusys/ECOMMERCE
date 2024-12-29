import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { ITag } from "./tag-data.interface";

export interface ITagStoreState {
  data: IResponsePayload<ITag[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: ITag | null,

  loading: boolean,
}
