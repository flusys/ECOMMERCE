import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IAttributeValue } from "./attribute-value-data.interface";

export interface IAttributeValueStoreState {
  data: IResponsePayload<IAttributeValue[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IAttributeValue | null,

  loading: boolean,
}
