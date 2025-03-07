import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IUser } from "./user-data.interface";

export interface IUserStoreState {
  data: IResponsePayload<IUser[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IUser | null,

  loading: boolean,
}
