
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
    category: any;
    brand: any;
    company: any;
    tags: any[];
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
    ingredients: { key: string, value: string }[];
    trackQuantity: number;
    earnPoint: number;
    parentInfo: IParentProduct;
    variants: any[];
    variantIds: number[];
    status: string;
    isActive: boolean;
    activeOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}