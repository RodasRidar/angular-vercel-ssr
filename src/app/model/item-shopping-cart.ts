import { Product } from "./product.interface";

export interface ItemShoppingCart {
    product: Product;
    quantity: number;
}
export interface ShoppingCart{
    items: ItemShoppingCart[]
    total: number
    totalItems: number
    subTotal: number
    totalDiscount: number
    tax?: number
}