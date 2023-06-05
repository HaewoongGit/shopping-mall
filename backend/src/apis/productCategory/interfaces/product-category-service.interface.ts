import { CategoryName } from "../entities/productCategory.entity";

export interface IProductCategoryServiceCreate {
    categoryName: CategoryName;
}

export interface IProductCategoryServiceUpdate {
    productCategoryId: string;
    categoryName: CategoryName;
}
