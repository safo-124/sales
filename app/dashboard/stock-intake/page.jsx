'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function StockIntakePage() {
  const [products, setProducts] = useState([]);
  const [intakeItems, setIntakeItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      if (res.ok) {
        setProducts(await res.json());
      }
    }
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product || quantity <= 0) return;

    const existingItem = intakeItems.find(item => item.productId === product.id);
    if (existingItem) {
      setIntakeItems(intakeItems.map(item =>
        item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setIntakeItems([...intakeItems, {
        productId: product.id,
        name: product.name,
        quantity: quantity,
      }]);
    }
    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setIntakeItems(intakeItems.filter(item => item.productId !== productId));
  };

  const handleConfirmIntake = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stock-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeItems }),
      });

      if (res.ok) {
        toast.success("Stock added successfully!");
        router.push('/dashboard/products');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || `Failed to update stock.`);
      }
    } catch (error) {
        toast.error("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Stock Intake</CardTitle>
          <CardDescription>Add new inventory for your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Current: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Quantity to Add"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              min="1"
            />
            <Button onClick={handleAddItem}>Add to List</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity to Add</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intakeItems.map(item => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
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
        <CardFooter className="flex justify-end mt-6">
          <Button onClick={handleConfirmIntake} disabled={isLoading || intakeItems.length === 0} size="lg">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Confirming...' : 'Confirm Stock Intake'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}