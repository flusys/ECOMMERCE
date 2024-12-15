import { IBrand } from "../brand/brand.interface";
import { ICategory } from "../category/category.interface";
import { ICompany } from "../company/company.interface";
import { ITag } from "../tag/tag.interface";
import { IProduct } from "./product.interface";

export interface IParentProduct  {
  _id?: string;
  readOnly: boolean;
  name: string;
  slug: string;
  image: string[];
  description: string;
  isHtml: boolean;
  serial: number;
  shortDesc: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  videoUrl: string;
  videoThumbnailImage: string;
  unit: string;
  specifications: { name: string; value: string }[];
  category: ICategory;
  brand: IBrand;
  company: ICompany;
  tags: ITag[];
  tagIds: number[];
  products: IProduct[];
  isFeature: boolean;
  status: string;
  isActive: boolean;
}
