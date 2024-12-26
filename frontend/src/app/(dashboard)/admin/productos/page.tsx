"use client";

import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { fetchProducts, deleteProduct } from '@/services/productService';
import { Product } from '@/types/Product';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import { toast } from "sonner"

const PRODUCTS_CACHE_KEY = '/api/products';

export default function AdminProductoPage() {
  const router = useRouter();
  
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    PRODUCTS_CACHE_KEY,
    async () => {
      const response = await fetchProducts();
      console.log('API Response:', response); // Debug log
      
      // Ensure we have an array of products
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from API');
      }
      
      return response;
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      onSuccess: (data) => {
        console.log('SWR Success - Products:', data); // Debug log
      },
      onError: (err) => {
        console.error('SWR Error:', err); // Debug log
      }
    }
  );

  // Ensure products is always an array
  const products = Array.isArray(data) ? data : [];

  const formatPrice = (price: any): string => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : 'N/A';
  };

  const handleAddProduct = () => {
    router.push('/admin/productos/nuevo');
  };

  const handleEditProduct = (id: number) => {
    router.push(`/admin/productos/editar/${id}`);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await deleteProduct(id);
        toast.success("Producto eliminado exitosamente");
        // Update the cache optimistically
        mutate(
          (currentProducts) => 
            Array.isArray(currentProducts) 
              ? currentProducts.filter(p => p.id !== id)
              : [],
          false
        );
        // Then revalidate
        mutate();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("No se pudo eliminar el producto");
        mutate();
      }
    }
  };

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error al cargar los productos. Por favor, intente nuevamente.
          {error.message && `: ${error.message}`}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Productos</CardTitle>
        <Button onClick={handleAddProduct}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Producto
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron productos</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category?.name || 'N/A'}</TableCell>
                    <TableCell>{product.size || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description || 'N/A'}</TableCell>
                    <TableCell>${formatPrice(product.unit_price)}</TableCell>
                    <TableCell>{product.current_stock}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditProduct(product.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}