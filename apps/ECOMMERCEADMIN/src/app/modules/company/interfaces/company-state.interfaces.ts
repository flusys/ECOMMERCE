import { IResponsePayload, IFilter, ISort } from "flusysng/shared/interfaces";
import { ICompany } from "./company-data.interface";

export interface ICompanyStoreState {
  data: IResponsePayload<ICompany[]>,

  filter: IFilter | null,
  sort: ISort | null,
  select: string[],

  editModelData: ICompany | null,

  loading: boolean,
}
