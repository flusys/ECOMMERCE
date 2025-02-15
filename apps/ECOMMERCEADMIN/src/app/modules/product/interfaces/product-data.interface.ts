import { IAttributeValue } from "../../attribute/interfaces/attribute-value-data.interface";
import { IBrand } from "../../brand/interfaces/brand-data.interface";
import { ICategory } from "../../category/interfaces/category-data.interface";
import { ICompany } from "../../company/interfaces/company-data.interface";
import { ITag } from "../../tag/interfaces/tag-data.interface";


export interface IParentProduct {
    id: number;
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
    specifications: { name: string, value: string }[];
    category: ICategory;
    brand: IBrand;
    company: ICompany;
    tags: ITag[];
    tagIds: number[];
    products: IProduct[];
    isFeature: boolean;
    status: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProduct {
    id: number;
    readOnly: boolean;
    image: string;
    warning: string;
    warningDay: number;
    taxType: number;
    taxAmount: number;
    refundable: boolean;
    returnable: boolean;
    sku: string;
    barCode: string;
    price: number;
    orderLimit: number;
    ingredients: { name: string, value: string }[];
    trackQuantity: number;
    earnPoint: number;
    parentInfo: IParentProduct;
    variants: IAttributeValue[];
    variantIds: number[];
    status: string;
    isActive: boolean;
    activeOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;


    //Order
    quantity:number,
    orderid:number
}