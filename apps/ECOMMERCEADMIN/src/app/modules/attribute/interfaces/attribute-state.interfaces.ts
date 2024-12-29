import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IAttribute } from "./attribute-data.interface";

export interface IAttributeStoreState {
  data: IResponsePayload<IAttribute[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IAttribute | null,

  loading: boolean,
}
