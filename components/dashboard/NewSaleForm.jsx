// src/components/dashboard/NewSaleForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NewSaleForm({ products }) {
  const [saleItems, setSaleItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product || quantity <= 0) return;

    // Check if item is already in the list
    const existingItem = saleItems.find(item => item.productId === product.id);
    if (existingItem) {
      // Update quantity if item already exists
      setSaleItems(saleItems.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      // Add new item
      setSaleItems([...saleItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      }]);
    }
    // Reset inputs
    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  const total = saleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRecordSale = async () => {
    setIsLoading(true);
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total: total,
        saleItems: saleItems.map(({ name, ...item }) => item) // Exclude name field
      }),
    });

    if (res.ok) {
      router.push('/dashboard'); // Or a sales history page
      router.refresh();
    } else {
      const error = await res.json();
      alert(`Failed to record sale: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Record a New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.filter(p => p.stock > 0).map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              min="1"
            />
            <Button onClick={handleAddItem}>Add to Sale</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saleItems.map(item => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">GHS {item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">GHS {(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.productId)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-bold">Total: GHS {total.toFixed(2)}</h2>
          <Button onClick={handleRecordSale} disabled={isLoading || saleItems.length === 0} size="lg">
            {isLoading ? 'Recording...' : 'Record Sale'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}