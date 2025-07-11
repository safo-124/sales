// src/app/dashboard/products/new/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        price,
        stock,
        description,
      }),
    });

    setIsLoading(false);
    router.push('/dashboard'); // Redirect to dashboard after creation
    router.refresh(); // Refresh server components on the dashboard
  };

  return (
    <div className="flex justify-center items-center h-full p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add a New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Price (GHS)</label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock Quantity</label>
              <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description (Optional)</label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}