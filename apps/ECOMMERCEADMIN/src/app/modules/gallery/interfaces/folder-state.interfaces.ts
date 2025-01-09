import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { IFolder } from "./folder-data.interface";

export interface IFolderStoreState {
  data: IResponsePayload<IFolder[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: IFolder | null,

  loading: boolean,
}
