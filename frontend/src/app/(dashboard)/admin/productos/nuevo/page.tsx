"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { createProduct, fetchCategories } from '@/services/productService';
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

const PRODUCTS_CACHE_KEY = '/api/products';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productData, setProductData] = useState<Partial<Product>>({
    name: '',
    category_id: undefined,
    size: '',
    description: '',
    unit_price: 0,
    current_stock: 0
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("No se pudieron cargar las categorías");
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'unit_price' || name === 'current_stock' ? parseFloat(value) : value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setProductData(prev => ({
      ...prev,
      category_id: parseInt(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.name || !productData.category_id) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }

    try {
      await createProduct(productData);
      toast.success("Producto creado exitosamente");
      // Revalidar los datos después de crear
      await mutate(PRODUCTS_CACHE_KEY);
      router.push('/admin/productos');
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("No se pudo crear el producto");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/admin/productos')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Añadir Nuevo Producto</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nombre *</label>
              <Input 
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Categoría *</label>
              <Select 
                onValueChange={handleCategoryChange}
                value={productData.category_id?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block mb-2">Descripción</label>
            <textarea 
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Tamaño</label>
              <Input 
                name="size"
                value={productData.size}
                onChange={handleInputChange}
                placeholder="Ej. S, M, L"
              />
            </div>
            <div>
              <label className="block mb-2">Precio Unitario *</label>
              <Input 
                type="number"
                name="unit_price"
                value={productData.unit_price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Stock Actual *</label>
              <Input 
                type="number"
                name="current_stock"
                value={productData.current_stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/productos')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Producto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}