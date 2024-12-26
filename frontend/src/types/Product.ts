// src/types/Product.ts
import { Category } from './Category';

export interface Product {
    id: number;
    name: string;
    category: Category;
    category_id: number;
    size?: string;
    description?: string;
    unit_price: number;
    current_stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}