import api from '@/services/api';
import { Product } from '../types/Product';
import { Category } from '../types/Category';

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products/');
        
        // Log the full response for debugging
        console.log('API Response:', response);
        
        // Check if response.data exists and is an array
        if (!response.data) {
            console.error('No data in response:', response);
            return [];
        }
        
        // If response.data is not an array but has a results property (common in DRF)
        if (!Array.isArray(response.data) && response.data.results) {
            return response.data.results;
        }
        
        // If response.data is an array, return it directly
        if (Array.isArray(response.data)) {
            return response.data;
        }
        
        console.error('Unexpected response format:', response.data);
        return [];
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    try {
        const response = await api.post('/products/', productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (productId: number, productData: Partial<Product>): Promise<Product> => {
    try {
        const response = await api.put(`/products/${productId}/`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (productId: number): Promise<void> => {
    try {
        await api.delete(`/products/${productId}/`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};


export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories/');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};