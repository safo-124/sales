// src/components/dashboard/EditProductForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function EditProductForm({ product, categories }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [description, setDescription] = useState(product.description || '');
  const [categoryId, setCategoryId] = useState(product.categoryId || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, stock, description, categoryId }),
    });

    setIsLoading(false);
    if (res.ok) {
      toast.success("Product updated successfully!");
      router.push('/dashboard');
      router.refresh();
    } else {
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update the product's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Product Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
             <div>
              <label>Category</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label>Price (GHS)</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label>Stock Quantity</label>
              <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div>
              <label>Description (Optional)</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}