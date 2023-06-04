import { UpdateProductInput } from '../dto/updateProduct.input';

export interface IProductServiceUpdate {
    productId: string;
    updateProductInput: UpdateProductInput;
}
